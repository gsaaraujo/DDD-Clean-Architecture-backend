import { Controller } from '../../../shared/helpers/controller';

export type DenyAnAgreementControllerInput = {
  partyId: string;
  agreementId: string;
};

export type DenyAnAgreementControllerOutput = void;

export interface IDenyAnAgreementController
  extends Controller<DenyAnAgreementControllerInput, DenyAnAgreementControllerOutput> {}
