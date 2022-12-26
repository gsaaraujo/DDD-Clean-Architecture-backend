import { DomainError } from '@core/helpers/errors/domain-error';

export class CharactersLimitError extends DomainError {
  public constructor(message: string) {
    super('CharactersLimitError', message);
  }
}
