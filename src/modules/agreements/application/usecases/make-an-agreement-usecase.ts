import { left, right } from '../../../shared/helpers/either';

import { Agreement } from '../../domain/entities/agreement';
import { OwingItem } from '../../domain/value-objects/owing-item';

import { IPartyRepository } from '../repositories/party-repository';
import { IAgreementRepository } from '../repositories/agreement-repository';

import { INotificationService } from '../services/notification-service';

import { DebtorPartyNotFoundError } from '../errors/debtor-party-not-found-error';
import { CreditorPartyNotFoundError } from '../errors/creditor-party-not-found-error';

import {
  IMakeAnAgreementUsecase,
  MakeAnAgreementResponse,
  MakeAnAgreementUsecaseInput,
} from '../../domain/usecases/make-an-agreement-usecase';

export class MakeAnAgreementUsecase implements IMakeAnAgreementUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(input: MakeAnAgreementUsecaseInput): Promise<MakeAnAgreementResponse> {
    const doesCreditorPartyExists: boolean = await this.partyRepository.exists(
      input.creditorPartyId,
    );

    if (!doesCreditorPartyExists) {
      const error = new CreditorPartyNotFoundError('Creditor party not found');
      return left(error);
    }

    const doesDebtorPartyExists: boolean = await this.partyRepository.exists(input.debtorPartyId);

    if (!doesDebtorPartyExists) {
      const error = new DebtorPartyNotFoundError('Debtor party not found');
      return left(error);
    }

    const owingItemOrError = OwingItem.create({
      amount: input.amount,
      isCurrency: input.isCurrency,
      description: input.description,
    });

    if (owingItemOrError.isLeft()) {
      const error = owingItemOrError.value;
      return left(error);
    }

    const owingItem = owingItemOrError.value;

    const agreementOrError = Agreement.create({
      owingItem,
      debtorPartyId: input.debtorPartyId,
      creditorPartyId: input.creditorPartyId,
    });

    if (agreementOrError.isLeft()) {
      const error = agreementOrError.value;
      return left(error);
    }

    const agreement = agreementOrError.value;
    await this.agreementRepository.create(agreement);

    this.notificationService.notifyParties(input.creditorPartyId, input.debtorPartyId);

    return right(agreement);
  }
}
