import { BaseError } from '../../../shared/helpers/base-error';

export class DebtorPartyNotFoundError extends BaseError {
  public constructor(message: string) {
    super('DebtorPartyNotFoundError', message);
  }
}
