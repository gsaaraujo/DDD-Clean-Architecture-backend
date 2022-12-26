import { DomainError } from '../../../core/helpers/errors/domain-error';

export class CreditorAndDebtorCannotBeTheSameError extends DomainError {
  public constructor(message: string) {
    super('CreditorAndDebtorCannotBeTheSameError', message);
  }
}
