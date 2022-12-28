import { Either, left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  IAcceptAnAgreementUsecase,
  AcceptAnAgreementUsecaseInput,
  AcceptAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/accept-an-agreement-usecase';
import { INotifyPartiesUsecase } from '@agreements/domain/usecases/notify-parties-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

export class AcceptAnAgreementUsecase implements IAcceptAnAgreementUsecase {
  public constructor(
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: AcceptAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, AcceptAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    // prettier-ignore
    const acceptAgreementOrError = input.partyId === agreement.creditorPartyId
        ? agreement.creditorPartyConsent.acceptAgreement()
        : agreement.debtorPartyConsent.acceptAgreement();

    if (acceptAgreementOrError.isLeft()) {
      const error = acceptAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    await this.notifyPartiesUsecase.execute({
      title: 'The agreement was accepted',
      content: `The party ${input.partyId} has accepted the agreeement`,
      debtorPartyId: agreement.debtorPartyId,
      creditorPartyId: agreement.creditorPartyId,
    });

    return right(undefined);
  }
}
