import { Either, left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { ApplicationError } from '@core/domain/errors/application-error';

import { PartyConsentStatus } from '@agreements/domain/entities/party-consent';
import {
  IRemoveAnAgreementUsecase,
  RemoveAnAgreementUsecaseInput,
  RemoveAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/remove-an-agreement-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { CannotRemoveAgreementError } from '@agreements/application/errors/cannot-remove-agreement-error';

import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

export class RemoveAnAgreementUsecase implements IRemoveAnAgreementUsecase {
  public constructor(private readonly agreementRepository: IAgreementRepository) {}

  async execute(
    input: RemoveAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, RemoveAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

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
