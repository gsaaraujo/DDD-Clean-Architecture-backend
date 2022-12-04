import { BaseError } from '../../../shared/helpers/base-error';

export class CurrentStatusMustBePendingError extends BaseError {
  public constructor(message: string) {
    super('CurrentStatusMustBePendingError', message);
  }
}
