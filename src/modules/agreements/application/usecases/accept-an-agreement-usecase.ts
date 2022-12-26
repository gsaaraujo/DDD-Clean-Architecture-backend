import { Either, left, right } from '../../../core/helpers/either';
import { DomainError } from '../../../core/helpers/errors/domain-error';
import { ApplicationError } from '../../../core/helpers/errors/application-error';

import {
  IAcceptAnAgreementUsecase,
  AcceptAnAgreementUsecaseInput,
  AcceptAnAgreementUsecaseOutput,
} from '../../domain/usecases/accept-an-agreement-usecase';
import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { IAgreementRepository } from '../../adapters/repositories/agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

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
