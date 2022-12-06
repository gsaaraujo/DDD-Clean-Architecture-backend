import { BaseError } from '../../../shared/helpers/base-error';

export class CreditorPartyNotFoundError extends BaseError {
  public constructor(message: string) {
    super('CreditorPartyNotFoundError', message);
  }
}
