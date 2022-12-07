import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';
import { BaseError } from '../../../shared/helpers/base-error';

export type PayAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type PayAnAgreementUsecaseOutput = void;

export type PayAnAgreementUsecaseResponse = Either<BaseError, PayAnAgreementUsecaseOutput>;

export interface IPayAnAgreementUsecase
  extends Usecase<PayAnAgreementUsecaseInput, PayAnAgreementUsecaseResponse> {}
