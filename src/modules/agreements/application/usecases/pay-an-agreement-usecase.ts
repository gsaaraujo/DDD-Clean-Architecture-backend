import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors/domain-error';
import { ApplicationError } from '../../../shared/helpers/errors/application-error';

import {
  IPayAnAgreementUsecase,
  PayAnAgreementUsecaseInput,
  PayAnAgreementUsecaseOutput,
} from '../../domain/usecases/pay-an-agreement-usecase';

import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { IAgreementRepository } from '../../adapters/repositories/agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

export class PayAnAgreementUsecase implements IPayAnAgreementUsecase {
  public constructor(
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: PayAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, PayAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    // prettier-ignore
    const payAgreementOrError = input.partyId === agreement.creditorPartyId
        ? agreement.creditorPartyConsent.payAgreement()
        : agreement.debtorPartyConsent.payAgreement();

    if (payAgreementOrError.isLeft()) {
      const error = payAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    await this.notifyPartiesUsecase.execute({
      title: 'The agreement was payed',
      content: `The party ${input.partyId} has payed the agreeement`,
      debtorPartyId: agreement.debtorPartyId,
      creditorPartyId: agreement.creditorPartyId,
    });

    return right(undefined);
  }
}
