import { DomainError } from '../../../shared/helpers/errors/domain-error';

export class NotificationHasAlreadyBeenReadError extends DomainError {
  public constructor(message: string) {
    super('NotificationHasAlreadyBeenReadError', message);
  }
}
