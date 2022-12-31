/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  NotificationDTO,
  INotificationService,
} from '@agreements/adapters/services/notification-service';

export class FakeNotificationService implements INotificationService {
  async send(notificationDTO: NotificationDTO): Promise<void> {
    return;
  }
}
