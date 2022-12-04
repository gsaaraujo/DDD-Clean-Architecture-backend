import { BaseError } from '../../../shared/helpers/base-error';

export class CurrentStatusMustBeOfferedError extends BaseError {
  public constructor(message: string) {
    super('CurrentStatusMustBeOfferedError', message);
  }
}
