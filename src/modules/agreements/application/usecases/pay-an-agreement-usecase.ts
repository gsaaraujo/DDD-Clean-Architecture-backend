import { Either, left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  IPayAnAgreementUsecase,
  PayAnAgreementUsecaseInput,
  PayAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/pay-an-agreement-usecase';
import { INotifyPartiesUsecase } from '@agreements/domain/usecases/notify-parties-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

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

    const isCreditor = input.partyId === agreement.creditorPartyId;

    const payAgreementOrError = isCreditor
      ? agreement.creditorPartyConsent.payAgreement()
      : agreement.debtorPartyConsent.payAgreement();

    if (payAgreementOrError.isLeft()) {
      const error = payAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    const notifyPartiesOrError = await this.notifyPartiesUsecase.execute({
      title: 'Agreement paid!',
      content: `The ${
        isCreditor ? `creditor ${agreement.creditorPartyId}` : `debtor ${agreement.debtorPartyId}`
      } has paid his part of the agreement.`,
      partyId: isCreditor ? agreement.debtorPartyId : agreement.creditorPartyId,
    });

    if (notifyPartiesOrError.isLeft()) {
      const error = notifyPartiesOrError.value;
      return left(error);
    }

    return right(undefined);
  }
}
