import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';

import { BaseError } from '../../../shared/helpers/base-error';

export type MakeAnAgreementUsecaseInput = {
  debtorPartyId: string;
  creditorPartyId: string;

  amount: number;
  isCurrency: boolean;
  description: string;
};

export type MakeAnAgreementUsecaseOutput = void;

export type MakeAnAgreementResponse = Either<BaseError, MakeAnAgreementUsecaseOutput>;

export interface IMakeAnAgreementUsecase
  extends Usecase<MakeAnAgreementUsecaseInput, MakeAnAgreementResponse> {}
