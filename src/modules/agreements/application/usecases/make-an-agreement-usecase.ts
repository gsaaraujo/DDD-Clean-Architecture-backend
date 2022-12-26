import { DomainError } from '@core/helpers/errors/domain-error';
import { ApplicationError } from '@core/helpers/errors/application-error';
import { chainAsyncEithers, Either, left, right } from '@core/helpers/either';
import { IVerifyPartyExistsUsecase } from '@core/domain/usecases/verify-party-exists-usecase';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { INotifyPartiesUsecase } from '@agreements/domain/usecases/notify-parties-usecase';
import {
  IMakeAnAgreementUsecase,
  MakeAnAgreementUsecaseInput,
  MakeAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/make-an-agreement-usecase';

import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

export class MakeAnAgreementUsecase implements IMakeAnAgreementUsecase {
  public constructor(
    private readonly verifyPartyExistsUsecase: IVerifyPartyExistsUsecase,
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: MakeAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, MakeAnAgreementUsecaseOutput>> {
    const error = await chainAsyncEithers([
      this.verifyPartyExistsUsecase.execute({ partyId: input.creditorPartyId }),
      this.verifyPartyExistsUsecase.execute({ partyId: input.debtorPartyId }),
    ]);

    if (error) return left(error);

    const owingItemOrError = OwingItem.create({
      amount: input.amount,
      isCurrency: input.isCurrency,
      description: input.description,
    });

    if (owingItemOrError.isLeft()) {
      const error = owingItemOrError.value;
      return left(error);
    }

    const owingItem = owingItemOrError.value;

    const agreementOrError = Agreement.create({
      owingItem,
      debtorPartyId: input.debtorPartyId,
      creditorPartyId: input.creditorPartyId,
    });

    if (agreementOrError.isLeft()) {
      const error = agreementOrError.value;
      return left(error);
    }

    const agreement = agreementOrError.value;
    await this.agreementRepository.create(agreement);

    await this.notifyPartiesUsecase.execute({
      title: 'A agreement was created',
      content: '',
      // content: `${input.partyId} has created a new agreement and would like you to review and accept it.`,
      debtorPartyId: agreement.debtorPartyId,
      creditorPartyId: agreement.creditorPartyId,
    });

    return right(undefined);
  }
}
