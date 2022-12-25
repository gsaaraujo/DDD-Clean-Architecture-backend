import { Usecase } from '../../helpers/usecase';

export type VerifyPartyExistsUsecaseInput = {
  partyId: string;
};

export type VerifyPartyExistsUsecaseOutput = void;

export interface IVerifyPartyExistsUsecase
  extends Usecase<VerifyPartyExistsUsecaseInput, VerifyPartyExistsUsecaseOutput> {}
