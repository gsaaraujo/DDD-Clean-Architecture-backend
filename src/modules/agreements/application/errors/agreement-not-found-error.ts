import { ApplicationError } from '../../../shared/helpers/errors/application-error';

export class AgreementNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('AgreementNotFoundError', message);
  }
}
