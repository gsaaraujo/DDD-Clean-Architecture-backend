import { Usecase } from '@core/helpers/usecase';

export type NotifyPartiesUsecaseInput = {
  debtorPartyId: string;
  creditorPartyId: string;

  title: string;
  content: string;
};

export type NotifyPartiesUsecaseOutput = void;

export interface INotifyPartiesUsecase
  extends Usecase<NotifyPartiesUsecaseInput, NotifyPartiesUsecaseOutput> {}
