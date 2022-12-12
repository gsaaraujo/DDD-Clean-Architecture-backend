import { DomainError } from '../../../shared/helpers/errors/domain-error';

export class CurrentStatusMustBeOfferedError extends DomainError {
  public constructor(message: string) {
    super('CurrentStatusMustBeOfferedError', message);
  }
}
