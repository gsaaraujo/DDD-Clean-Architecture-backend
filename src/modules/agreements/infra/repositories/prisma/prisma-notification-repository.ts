import { PrismaClient } from '@prisma/client';

import { Notification } from '@agreements/domain/entities/notification';

import { NotificationMapper } from '@agreements/infra/repositories/prisma/mappers/prisma-notification-mapper';
import { INotificationRepository } from '@agreements/application/repositories/notification-repository';

export class PrismaNotificationRepository implements INotificationRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async create(notification: Notification): Promise<Notification> {
    const newNotification = await this.prismaClient.notification.create({
      data: NotificationMapper.toPersistence(notification),
    });

    return NotificationMapper.toDomain(newNotification);
  }
}
