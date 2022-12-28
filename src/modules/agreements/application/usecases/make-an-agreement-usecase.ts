import { Either, left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { ApplicationError } from '@core/domain/errors/application-error';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { INotifyPartiesUsecase } from '@agreements/domain/usecases/notify-parties-usecase';
import {
  IMakeAnAgreementUsecase,
  MakeAnAgreementUsecaseInput,
  MakeAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/make-an-agreement-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';
import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

export class MakeAnAgreementUsecase implements IMakeAnAgreementUsecase {
  public constructor(
    private readonly notifyPartiesUsecase: INotifyPartiesUsecase,
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: MakeAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, MakeAnAgreementUsecaseOutput>> {
    const [creditorExists, debtorExists] = await Promise.all([
      this.partyRepository.exists(input.creditorPartyId),
      this.partyRepository.exists(input.debtorPartyId),
    ]);

    if (!creditorExists || !debtorExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

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
