import { Controller } from '@core/domain/helpers/controller';

import { Agreement } from '@agreements/domain/entities/agreement';

export type GetAgreementsControllerInput = {
  partyId: string;
};

export type GetAgreementsControllerOutput = Agreement[];

export interface IGetAgreementsController
  extends Controller<GetAgreementsControllerInput, GetAgreementsControllerOutput> {}
