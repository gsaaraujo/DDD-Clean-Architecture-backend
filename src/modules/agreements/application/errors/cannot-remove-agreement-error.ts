import { BaseError } from '../../../shared/helpers/base-error';

export class CannotRemoveAgreementError extends BaseError {
  public constructor(message: string) {
    super('CannotRemoveAgreementError', message);
  }
}
