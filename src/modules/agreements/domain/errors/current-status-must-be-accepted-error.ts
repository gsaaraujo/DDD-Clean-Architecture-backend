import { DomainError } from '@core/helpers/errors/domain-error';

export class CurrentStatusMustBeAcceptedError extends DomainError {
  public constructor(message: string) {
    super('CurrentStatusMustBeAcceptedError', message);
  }
}
