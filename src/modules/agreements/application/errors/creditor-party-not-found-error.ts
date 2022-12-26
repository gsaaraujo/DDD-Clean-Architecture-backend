import { ApplicationError } from '../../../core/helpers/errors/application-error';

export class CreditorPartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('CreditorPartyNotFoundError', message);
  }
}
