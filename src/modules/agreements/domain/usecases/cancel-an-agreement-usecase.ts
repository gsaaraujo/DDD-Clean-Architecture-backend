import { Usecase } from '../../../shared/helpers/usecase';

export type CancelAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type CancelAnAgreementUsecaseOutput = void;

export interface ICancelAnAgreementUsecase
  extends Usecase<CancelAnAgreementUsecaseInput, CancelAnAgreementUsecaseOutput> {}
