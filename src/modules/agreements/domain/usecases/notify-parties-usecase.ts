import { Usecase } from '../../../shared/helpers/usecase';

export type NotifyPartiesUsecaseInput = {
  debtorPartyId: string;
  creditorPartyId: string;

  title: string;
  content: string;
};

export type NotifyPartiesUsecaseOutput = void;

export interface INotifyPartiesUsecase
  extends Usecase<NotifyPartiesUsecaseInput, NotifyPartiesUsecaseOutput> {}
