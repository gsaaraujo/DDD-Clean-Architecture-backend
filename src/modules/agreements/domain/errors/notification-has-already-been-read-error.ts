import { DomainError } from '@core/helpers/errors/domain-error';

export class NotificationHasAlreadyBeenReadError extends DomainError {
  public constructor(message: string) {
    super('NotificationHasAlreadyBeenReadError', message);
  }
}