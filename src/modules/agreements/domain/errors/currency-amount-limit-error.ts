import { BaseError } from '../../../shared/helpers/base-error';

export class CurrencyItemAmountLimitError extends BaseError {
  public constructor(message: string) {
    super('CurrencyItemAmountLimitError', message);
  }
}
