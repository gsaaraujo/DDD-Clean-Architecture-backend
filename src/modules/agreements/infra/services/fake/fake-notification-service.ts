/* eslint-disable @typescript-eslint/no-unused-vars */

import { NotificationProps } from 'src/modules/agreements/domain/entities/notification';

import { INotificationService } from '../../../adapters/services/notification-service';

export class FakeNotificationService implements INotificationService {
  public sendCalledTimes = 0;

  async send(notificationDTO: NotificationProps): Promise<void> {
    this.sendCalledTimes += 1;
    return;
  }
}
