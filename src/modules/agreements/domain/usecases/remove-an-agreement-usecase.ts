import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';
import { BaseError } from '../../../shared/helpers/base-error';

export type RemoveAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type RemoveAnAgreementUsecaseOutput = void;

export type RemoveAnAgreementUsecaseResponse = Either<BaseError, RemoveAnAgreementUsecaseOutput>;

export interface IRemoveAnAgreementUsecase
  extends Usecase<RemoveAnAgreementUsecaseInput, RemoveAnAgreementUsecaseResponse> {}
