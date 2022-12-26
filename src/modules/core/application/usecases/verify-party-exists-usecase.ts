import { Either, left, right } from '@core/helpers/either';
import { ApplicationError } from '@core/helpers/errors/application-error';

import {
  IVerifyPartyExistsUsecase,
  VerifyPartyExistsUsecaseInput,
} from '@core/domain/usecases/verify-party-exists-usecase';

import { IPartyRepository } from '@core/adapters/repositories/party-repository';

import { PartyNotFoundError } from '@core/application/errors/party-not-found-error';

export class VerifyPartyExistsUsecase implements IVerifyPartyExistsUsecase {
  public constructor(private readonly partyRepository: IPartyRepository) {}

  async execute(input: VerifyPartyExistsUsecaseInput): Promise<Either<ApplicationError, void>> {
    const doesPartyExist = await this.partyRepository.exists(input.partyId);

    if (!doesPartyExist) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    return right(undefined);
  }
}
