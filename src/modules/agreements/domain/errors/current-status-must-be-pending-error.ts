import { DomainError } from '../../../shared/helpers/errors/domain-error';

export class CurrentStatusMustBePendingError extends DomainError {
  public constructor(message: string) {
    super('CurrentStatusMustBePendingError', message);
  }
}
