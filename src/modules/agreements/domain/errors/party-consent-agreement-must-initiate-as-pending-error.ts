import { BaseError } from '../../../shared/helpers/base-error';

export class PartyConsentAgreementMustInitiateAsPendingError extends BaseError {
  public constructor(message: string) {
    super('PartyConsentAgreementMustInitiateAsPendingError', message);
  }
}
