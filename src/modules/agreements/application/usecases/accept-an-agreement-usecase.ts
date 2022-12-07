import { BaseError } from '../../../shared/helpers/base-error';
import { Either, left, right } from '../../../shared/helpers/either';

import { INotificationService } from '../services/notification-service';

import { IPartyRepository } from '../repositories/party-repository';
import { IAgreementRepository } from '../repositories/agreement-repository';

import { PartyNotFoundError } from '../errors/party-not-found-error';
import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

import {
  IAcceptAnAgreementUsecase,
  AcceptAnAgreementUsecaseInput,
  AcceptAnAgreementUsecaseResponse,
} from '../../domain/usecases/accept-an-agreement-usecase';

export class AcceptAnAgreementUsecase implements IAcceptAnAgreementUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(input: AcceptAnAgreementUsecaseInput): Promise<AcceptAnAgreementUsecaseResponse> {
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

    let acceptAgreementOrError: Either<BaseError, void>;

    if (agreement.creditorPartyId === input.partyId) {
      acceptAgreementOrError = agreement.creditorPartyConsent.acceptAgreement();
    } else {
      acceptAgreementOrError = agreement.debtorPartyConsent.acceptAgreement();
    }

    if (acceptAgreementOrError.isLeft()) {
      const error = acceptAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);
    this.notificationService.notifyParties(agreement.creditorPartyId, agreement.debtorPartyId);

    return right(undefined);
  }
}
