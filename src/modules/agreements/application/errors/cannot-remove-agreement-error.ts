import { ApplicationError } from '../../../core/helpers/errors/application-error';

export class CannotRemoveAgreementError extends ApplicationError {
  public constructor(message: string) {
    super('CannotRemoveAgreementError', message);
  }
}
