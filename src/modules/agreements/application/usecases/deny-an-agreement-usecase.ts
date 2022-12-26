import { Either, left, right } from '../../../core/helpers/either';
import { DomainError } from '../../../core/helpers/errors/domain-error';
import { ApplicationError } from '../../../core/helpers/errors/application-error';

import {
  IDenyAnAgreementUsecase,
  DenyAnAgreementUsecaseInput,
  DenyAnAgreementUsecaseOutput,
} from '../../domain/usecases/deny-an-agreement-usecase';
import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { IAgreementRepository } from '../../adapters/repositories/agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

export class DenyAnAgreementUsecase implements IDenyAnAgreementUsecase {
  public constructor(
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: DenyAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, DenyAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    // prettier-ignore
    const denyAgreementOrError = input.partyId === agreement.creditorPartyId
        ? agreement.creditorPartyConsent.denyAgreement()
        : agreement.debtorPartyConsent.denyAgreement();

    if (denyAgreementOrError.isLeft()) {
      const error = denyAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    await this.notifyPartiesUsecase.execute({
      title: 'The agreement was denyed',
      content: `The party ${input.partyId} has denyed the agreeement`,
      debtorPartyId: agreement.debtorPartyId,
      creditorPartyId: agreement.creditorPartyId,
    });

    return right(undefined);
  }
}
