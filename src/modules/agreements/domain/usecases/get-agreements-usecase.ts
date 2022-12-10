import { Agreement } from '../entities/agreement';
import { Usecase } from '../../../shared/helpers/usecase';

export type GetAgreementsUsecaseInput = {
  partyId: string;
};

export type GetAgreementsUsecaseOutput = Agreement[];

export interface IGetAgreementsUsecase
  extends Usecase<GetAgreementsUsecaseInput, GetAgreementsUsecaseOutput> {}
