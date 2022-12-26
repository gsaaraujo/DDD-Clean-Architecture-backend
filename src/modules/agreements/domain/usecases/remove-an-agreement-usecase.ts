import { Usecase } from '../../../core/helpers/usecase';

export type RemoveAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type RemoveAnAgreementUsecaseOutput = void;

export interface IRemoveAnAgreementUsecase
  extends Usecase<RemoveAnAgreementUsecaseInput, RemoveAnAgreementUsecaseOutput> {}
