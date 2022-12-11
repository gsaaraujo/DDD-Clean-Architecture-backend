import { Controller } from '../../../shared/helpers/controller';

export type MakeAnAgreementControllerInput = {
  debtorPartyId: string;
  creditorPartyId: string;

  amount: number;
  isCurrency: boolean;
  description?: string;
};

export type MakeAnAgreementControllerOutput = void;

export interface IMakeAnAgreementController
  extends Controller<MakeAnAgreementControllerInput, MakeAnAgreementControllerOutput> {}
