import { BaseError } from '../../../shared/helpers/base-error';

export class PartyNotFoundError extends BaseError {
  public constructor(message: string) {
    super('PartyNotFoundError', message);
  }
}
