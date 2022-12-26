import { Either, right } from '../../../core/helpers/either';
import { ApplicationError } from '../../../core/helpers/errors/application-error';
import { IVerifyPartyExistsUsecase } from '../../../core/domain/usecases/verify-party-exists-usecase';

import {
  IGetAgreementsUsecase,
  GetAgreementsUsecaseInput,
  GetAgreementsUsecaseOutput,
} from '../../domain/usecases/get-agreements-usecase';

import { IAgreementRepository } from '../../adapters/repositories/agreement-repository';

export class GetAgreementsUsecase implements IGetAgreementsUsecase {
  public constructor(
    private readonly verifyPartyExistsUsecase: IVerifyPartyExistsUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: GetAgreementsUsecaseInput,
  ): Promise<Either<ApplicationError, GetAgreementsUsecaseOutput>> {
    await this.verifyPartyExistsUsecase.execute({ partyId: input.partyId });

    const agreement = await this.agreementRepository.findAllByPartyId(input.partyId);

    return right(agreement);
  }
}
