import { BaseError } from '../../../shared/helpers/base-error';

export class CurrentStatusMustBeAcceptedError extends BaseError {
  public constructor(message: string) {
    super('CurrentStatusMustBeAcceptedError', message);
  }
}
