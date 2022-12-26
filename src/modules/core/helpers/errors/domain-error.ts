import { BaseError } from '@core/helpers/errors/base-error';

export abstract class DomainError extends BaseError {
  protected constructor(name: string, message: string) {
    super('DomainError', name, message);
  }
}
