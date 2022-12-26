import { ApplicationError } from '../../../core/helpers/errors/application-error';

export class DebtorPartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('DebtorPartyNotFoundError', message);
  }
}
