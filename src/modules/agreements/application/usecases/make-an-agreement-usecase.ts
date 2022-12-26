import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors/domain-error';
import { ApplicationError } from '../../../shared/helpers/errors/application-error';
import { IVerifyPartyExistsUsecase } from '../../../shared/domain/usecases/verify-party-exists-usecase';

import { Agreement } from '../../domain/entities/agreement';
import { OwingItem } from '../../domain/value-objects/owing-item';

import {
  IMakeAnAgreementUsecase,
  MakeAnAgreementUsecaseInput,
  MakeAnAgreementUsecaseOutput,
} from '../../domain/usecases/make-an-agreement-usecase';
import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { IAgreementRepository } from '../../adapters/repositories/agreement-repository';

export class MakeAnAgreementUsecase implements IMakeAnAgreementUsecase {
  public constructor(
    private readonly verifyPartyExistsUsecase: IVerifyPartyExistsUsecase,
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: MakeAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, MakeAnAgreementUsecaseOutput>> {
    await this.verifyPartyExistsUsecase.execute({ partyId: input.creditorPartyId });
    await this.verifyPartyExistsUsecase.execute({ partyId: input.debtorPartyId });

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
