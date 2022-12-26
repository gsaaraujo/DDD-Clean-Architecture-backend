import { Controller } from '../../../core/helpers/controller';

export type CancelAnAgreementControllerInput = {
  partyId: string;
  agreementId: string;
};

export type CancelAnAgreementControllerOutput = void;

export interface ICancelAnAgreementController
  extends Controller<CancelAnAgreementControllerInput, CancelAnAgreementControllerOutput> {}
