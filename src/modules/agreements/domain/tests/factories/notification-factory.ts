import { Notification, NotificationProps } from '@agreements/domain/entities/notification';

type MakeNotificationProps = Partial<Omit<NotificationProps, 'createdAt' | 'readAt'>>;

export const makeNotification = (props?: MakeNotificationProps) => {
  return Notification.create({
    recipientPartyId: 'd5e4c4e4-6844-4c5b-8304-ec64ecfe8011',
    readAt: null,
    title: 'any_title',
    createdAt: new Date(),
    content: 'any_content',
    ...props,
  });
};
