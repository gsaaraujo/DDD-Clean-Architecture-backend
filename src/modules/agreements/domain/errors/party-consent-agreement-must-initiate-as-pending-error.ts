import { DomainError } from '../../../core/helpers/errors/domain-error';

export class PartyConsentAgreementMustInitiateAsPendingError extends DomainError {
  public constructor(message: string) {
    super('PartyConsentAgreementMustInitiateAsPendingError', message);
  }
}
