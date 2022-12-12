import { DomainError } from '../../../shared/helpers/errors/domain-error';

export class CurrencyItemAmountLimitError extends DomainError {
  public constructor(message: string) {
    super('CurrencyItemAmountLimitError', message);
  }
}
