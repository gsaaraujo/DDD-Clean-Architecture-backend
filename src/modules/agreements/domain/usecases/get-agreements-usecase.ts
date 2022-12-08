import { Agreement } from '../entities/agreement';
import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';
import { BaseError } from '../../../shared/helpers/base-error';

export type GetAgreementsUsecaseInput = {
  partyId: string;
};

export type GetAgreementsUsecaseOutput = Agreement[];

export type GetAgreementsUsecaseResponse = Either<BaseError, GetAgreementsUsecaseOutput>;

export interface IGetAgreementsUsecase
  extends Usecase<GetAgreementsUsecaseInput, GetAgreementsUsecaseResponse> {}
