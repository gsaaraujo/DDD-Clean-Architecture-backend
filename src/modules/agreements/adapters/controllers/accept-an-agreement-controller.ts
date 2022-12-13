import { Controller } from '../../../shared/helpers/controller';

export type AcceptAnAgreementControllerInput = {
  partyId: string;
  agreementId: string;
};

export type AcceptAnAgreementControllerOutput = void;

export interface IAcceptAnAgreementController
  extends Controller<AcceptAnAgreementControllerInput, AcceptAnAgreementControllerOutput> {}
