import { Controller } from '@core/domain/helpers/controller';

export type PayAnAgreementControllerInput = {
  partyId: string;
  agreementId: string;
};

export type PayAnAgreementControllerOutput = void;

export interface IPayAnAgreementController
  extends Controller<PayAnAgreementControllerInput, PayAnAgreementControllerOutput> {}
