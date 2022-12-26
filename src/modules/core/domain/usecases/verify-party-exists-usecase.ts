import { Usecase } from '@core/helpers/usecase';

export type VerifyPartyExistsUsecaseInput = {
  partyId: string;
};

export type VerifyPartyExistsUsecaseOutput = void;

export interface IVerifyPartyExistsUsecase
  extends Usecase<VerifyPartyExistsUsecaseInput, VerifyPartyExistsUsecaseOutput> {}
