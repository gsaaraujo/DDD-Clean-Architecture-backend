import { BaseError } from '../../../shared/helpers/base-error';

export class CreditorAndDebtorCannotBeTheSameError extends BaseError {
  public constructor(message: string) {
    super('CreditorAndDebtorCannotBeTheSameError', message);
  }
}
