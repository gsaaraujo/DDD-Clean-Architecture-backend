import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors/domain-error';
import { ApplicationError } from '../../../shared/helpers/errors/application-error';

import {
  ICancelAnAgreementUsecase,
  CancelAnAgreementUsecaseInput,
  CancelAnAgreementUsecaseOutput,
} from '../../domain/usecases/cancel-an-agreement-usecase';
import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { IAgreementRepository } from '../../adapters/repositories/agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

export class CancelAnAgreementUsecase implements ICancelAnAgreementUsecase {
  public constructor(
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: CancelAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, CancelAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    // prettier-ignore
    const cancelAgreementOrError = input.partyId === agreement.creditorPartyId
        ? agreement.creditorPartyConsent.cancelAgreement()
        : agreement.debtorPartyConsent.cancelAgreement();

    if (cancelAgreementOrError.isLeft()) {
      const error = cancelAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    await this.notifyPartiesUsecase.execute({
      title: 'The agreement was canceled',
      content: `The party ${input.partyId} has canceled the agreeement`,
      debtorPartyId: agreement.debtorPartyId,
      creditorPartyId: agreement.creditorPartyId,
    });

    return right(undefined);
  }
}
