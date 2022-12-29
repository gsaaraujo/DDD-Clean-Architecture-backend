import { BaseError } from '@core/domain/errors/base-error';

// Used for testing purposes
export class MockBaseError extends BaseError {
  public constructor() {
    super('MockBaseError', 'MockBaseError', 'MockBaseError');
  }
}
