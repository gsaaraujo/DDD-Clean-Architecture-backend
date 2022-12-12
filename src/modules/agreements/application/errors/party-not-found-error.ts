import { ApplicationError } from '../../../shared/helpers/errors/application-error';

export class PartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('PartyNotFoundError', message);
  }
}
