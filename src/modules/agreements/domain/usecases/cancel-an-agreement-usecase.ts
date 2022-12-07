import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';
import { BaseError } from '../../../shared/helpers/base-error';

export type CancelAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type CancelAnAgreementUsecaseOutput = void;

export type CancelAnAgreementUsecaseResponse = Either<BaseError, CancelAnAgreementUsecaseOutput>;

export interface ICancelAnAgreementUsecase
  extends Usecase<CancelAnAgreementUsecaseInput, CancelAnAgreementUsecaseResponse> {}
