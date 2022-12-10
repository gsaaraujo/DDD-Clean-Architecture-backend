import { BaseError } from '../../../shared/helpers/base-error';
import { Either, left, right } from '../../../shared/helpers/either';

import { INotificationService } from '../services/notification-service';

import { IPartyRepository } from '../repositories/party-repository';
import { IAgreementRepository } from '../repositories/agreement-repository';

import { PartyNotFoundError } from '../errors/party-not-found-error';
import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

import {
  IPayAnAgreementUsecase,
  PayAnAgreementUsecaseInput,
  PayAnAgreementUsecaseOutput,
} from '../../domain/usecases/pay-an-agreement-usecase';

export class PayAnAgreementUsecase implements IPayAnAgreementUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(
    input: PayAnAgreementUsecaseInput,
  ): Promise<Either<BaseError, PayAnAgreementUsecaseOutput>> {
    const doesPartyExist = await this.partyRepository.exists(input.partyId);

    if (!doesPartyExist) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const agreement = await this.agreementRepository.findByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    let payAgreementOrError: Either<BaseError, void>;

    if (agreement.creditorPartyId === input.partyId) {
      payAgreementOrError = agreement.creditorPartyConsent.payAgreement();
    } else {
      payAgreementOrError = agreement.debtorPartyConsent.payAgreement();
    }

    if (payAgreementOrError.isLeft()) {
      const error = payAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);
    this.notificationService.notifyParties(agreement.creditorPartyId, agreement.debtorPartyId);

    return right(undefined);
  }
}