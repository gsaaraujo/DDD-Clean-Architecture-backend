import { Usecase } from '@core/helpers/usecase';

export type AcceptAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type AcceptAnAgreementUsecaseOutput = void;

export interface IAcceptAnAgreementUsecase
  extends Usecase<AcceptAnAgreementUsecaseInput, AcceptAnAgreementUsecaseOutput> {}
