import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';
import { BaseError } from '../../../shared/helpers/base-error';

export type DenyAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type DenyAnAgreementUsecaseOutput = void;

export type DenyAnAgreementUsecaseResponse = Either<BaseError, DenyAnAgreementUsecaseOutput>;

export interface IDenyAnAgreementUsecase
  extends Usecase<DenyAnAgreementUsecaseInput, DenyAnAgreementUsecaseResponse> {}
