import { BaseError } from '../../../shared/helpers/base-error';

export class CurrencyAmountMustBeInCentsError extends BaseError {
  public constructor(message: string) {
    super('CurrencyAmountMustBeInCentsError', message);
  }
}
