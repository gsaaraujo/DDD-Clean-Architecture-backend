import { Usecase } from '@core/domain/helpers/usecase';

export type NotifyPartiesUsecaseInput = {
  partyId: string;
  title: string;
  content: string;
};

export type NotifyPartiesUsecaseOutput = void;

export interface INotifyPartiesUsecase
  extends Usecase<NotifyPartiesUsecaseInput, NotifyPartiesUsecaseOutput> {}
