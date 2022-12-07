import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';
import { BaseError } from '../../../shared/helpers/base-error';

export type AcceptAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type AcceptAnAgreementUsecaseOutput = void;

export type AcceptAnAgreementUsecaseResponse = Either<BaseError, AcceptAnAgreementUsecaseOutput>;

export interface IAcceptAnAgreementUsecase
  extends Usecase<AcceptAnAgreementUsecaseInput, AcceptAnAgreementUsecaseResponse> {}
