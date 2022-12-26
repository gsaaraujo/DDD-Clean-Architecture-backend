import { NotificationProps } from '@agreements/domain/entities/notification';

export type NotificationDTO = NotificationProps;

export interface INotificationRepository {
  create(notificationDTO: NotificationDTO): Promise<NotificationDTO>;
}
