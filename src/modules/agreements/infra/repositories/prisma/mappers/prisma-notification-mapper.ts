import { Notification as NotificationORM } from '@prisma/client';

import { Notification } from '@agreements/domain/entities/notification';

export class NotificationMapper {
  public static toDomain(notificationORM: NotificationORM): Notification {
    return Notification.create(
      {
        recipientPartyId: notificationORM.recipientPartyId,
        title: notificationORM.title,
        readAt: notificationORM.readAt,
        content: notificationORM.content,
        createdAt: notificationORM.createdAt,
      },
      notificationORM.id,
    ).value as Notification;
  }

  public static toPersistence(notification: Notification): NotificationORM {
    return {
      id: notification.id,
      recipientPartyId: notification.recipientPartyId,
      title: notification.title,
      readAt: notification.readAt,
      content: notification.content,
      sentAt: notification.createdAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
