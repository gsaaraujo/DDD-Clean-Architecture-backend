import { Usecase } from '@core/helpers/usecase';

export type PayAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type PayAnAgreementUsecaseOutput = void;

export interface IPayAnAgreementUsecase
  extends Usecase<PayAnAgreementUsecaseInput, PayAnAgreementUsecaseOutput> {}
