import { NotificationProps } from '@agreements/domain/entities/notification';

import {
  NotificationDTO,
  INotificationRepository,
} from '@agreements/adapters/repositories/notification-repository';

export class FakeNotificationRepository implements INotificationRepository {
  public notifications: NotificationDTO[] = [];

  async create(notificationDTO: NotificationProps): Promise<NotificationProps> {
    this.notifications.push(notificationDTO);
    return notificationDTO;
  }
}
