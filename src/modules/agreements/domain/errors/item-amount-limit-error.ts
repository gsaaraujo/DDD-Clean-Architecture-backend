import { BaseError } from '../../../shared/helpers/base-error';

export class ItemAmountLimitError extends BaseError {
  public constructor(message: string) {
    super('ItemAmountLimitError', message);
  }
}
