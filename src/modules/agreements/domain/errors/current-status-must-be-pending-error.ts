import { DomainError } from '../../../core/helpers/errors/domain-error';

export class CurrentStatusMustBePendingError extends DomainError {
  public constructor(message: string) {
    super('CurrentStatusMustBePendingError', message);
  }
}
