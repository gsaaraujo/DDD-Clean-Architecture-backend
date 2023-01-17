import { Controller } from '@core/domain/helpers/controller';

export type RemoveAnAgreementControllerInput = {
  partyId: string;
  agreementId: string;
};

export type RemoveAnAgreementControllerOutput = void;

export interface IRemoveAnAgreementController
  extends Controller<RemoveAnAgreementControllerInput, RemoveAnAgreementControllerOutput> {}
