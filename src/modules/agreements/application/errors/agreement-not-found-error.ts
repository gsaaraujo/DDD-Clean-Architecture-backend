import { BaseError } from '../../../shared/helpers/base-error';

export class AgreementNotFoundError extends BaseError {
  public constructor(message: string) {
    super('AgreementNotFoundError', message);
  }
}
