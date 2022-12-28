import { Either, left, right } from '@core/helpers/either';
import { DomainError } from '@core/helpers/errors/domain-error';
import { ApplicationError } from '@core/helpers/errors/application-error';

import {
  IGetAgreementsUsecase,
  GetAgreementsUsecaseInput,
  GetAgreementsUsecaseOutput,
} from '@agreements/domain/usecases/get-agreements-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';
import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

export class GetAgreementsUsecase implements IGetAgreementsUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: GetAgreementsUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, GetAgreementsUsecaseOutput>> {
    const partyExists = await this.partyRepository.exists(input.partyId);

    if (!partyExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const agreement = await this.agreementRepository.findAllByPartyId(input.partyId);

    return right(agreement);
  }
}
