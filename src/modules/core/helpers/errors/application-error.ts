import { BaseError } from './base-error';

export abstract class ApplicationError extends BaseError {
  protected constructor(name: string, message: string) {
    super('ApplicationError', name, message);
  }
}
