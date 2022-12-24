import { DomainError } from '../../../shared/helpers/errors/domain-error';

export class CharactersLimitError extends DomainError {
  public constructor(message: string) {
    super('CharactersLimitError', message);
  }
}
