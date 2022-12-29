/* eslint-disable @typescript-eslint/no-unused-vars */

import { NotificationProps } from '@agreements/domain/entities/notification';

import { INotificationService } from '@agreements/adapters/services/notification-service';

export class FakeNotificationService implements INotificationService {
  async send(notificationDTO: NotificationProps): Promise<void> {
    return;
  }
}
