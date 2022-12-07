import { left, right } from '../../../shared/helpers/either';

import { PartyConsentStatus } from '../../domain/entities/party-consent';

import { IAgreementRepository } from '../repositories/agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';
import { CannotRemoveAgreementError } from '../errors/cannot-remove-agreement-error';

import {
  IRemoveAnAgreementUsecase,
  RemoveAnAgreementUsecaseInput,
  RemoveAnAgreementUsecaseResponse,
} from '../../domain/usecases/remove-an-agreement-usecase';

export class RemoveAnAgreementUsecase implements IRemoveAnAgreementUsecase {
  public constructor(private readonly agreementRepository: IAgreementRepository) {}

  async execute(input: RemoveAnAgreementUsecaseInput): Promise<RemoveAnAgreementUsecaseResponse> {
    const agreement = await this.agreementRepository.findById(input.agreementId);

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    if (
      agreement.debtorPartyConsent.status !== PartyConsentStatus.PENDING ||
      agreement.creditorPartyConsent.status !== PartyConsentStatus.PENDING
    ) {
      const error = new CannotRemoveAgreementError('Only pending agreements can be removed');
      return left(error);
    }

    await this.agreementRepository.delete(input.agreementId);
    return right(undefined);
  }
}
