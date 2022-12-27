import { Either, left, right } from '@core/helpers/either';
import { ApplicationError } from '@core/helpers/errors/application-error';

import { PartyNotFoundError } from '@core/application/errors/party-not-found-error';

import { IVerifyPartyExistsUsecase } from '@core/domain/usecases/verify-party-exists-usecase';

import {
  IGetAgreementsUsecase,
  GetAgreementsUsecaseInput,
  GetAgreementsUsecaseOutput,
} from '@agreements/domain/usecases/get-agreements-usecase';

import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

export class GetAgreementsUsecase implements IGetAgreementsUsecase {
  public constructor(
    private readonly verifyPartyExistsUsecase: IVerifyPartyExistsUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: GetAgreementsUsecaseInput,
  ): Promise<Either<ApplicationError, GetAgreementsUsecaseOutput>> {
    const partyExists = await this.verifyPartyExistsUsecase.execute({ partyId: input.partyId });

    if (!partyExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const agreement = await this.agreementRepository.findAllByPartyId(input.partyId);

    return right(agreement);
  }
}
