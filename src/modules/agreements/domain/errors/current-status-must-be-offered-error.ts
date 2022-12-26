import { DomainError } from '@core/helpers/errors/domain-error';

export class CurrentStatusMustBeOfferedError extends DomainError {
  public constructor(message: string) {
    super('CurrentStatusMustBeOfferedError', message);
  }
}
