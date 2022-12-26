import { ApplicationError } from '../../../core/helpers/errors/application-error';

export class PartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('PartyNotFoundError', message);
  }
}
