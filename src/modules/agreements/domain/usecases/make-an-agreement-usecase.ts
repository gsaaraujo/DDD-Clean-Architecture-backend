import { Either } from '../../../shared/helpers/either';
import { Usecase } from '../../../shared/helpers/usecase';

import { BaseError } from '../../../shared/helpers/base-error';

import { Agreement } from '../entities/agreement';

export type MakeAnAgreementUsecaseInput = {
  debtorPartyId: string;
  creditorPartyId: string;

  amount: number;
  isCurrency: boolean;
  description: string;
};

export type MakeAnAgreementUsecaseOutput = Agreement;

export type MakeAnAgreementResponse = Either<BaseError, MakeAnAgreementUsecaseOutput>;

export interface IMakeAnAgreementUsecase
  extends Usecase<MakeAnAgreementUsecaseInput, MakeAnAgreementResponse> {}
