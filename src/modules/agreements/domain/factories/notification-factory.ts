import { Notification, NotificationProps } from '@agreements/domain/entities/notification';

type MakeNotificationProps = Partial<NotificationProps>;

export const makeNotification = (props?: MakeNotificationProps) => {
  return Notification.reconstitute('64499f96-dcdd-4d34-9996-06c5dfe0f05b', {
    readAt: null,
    title: 'any_title',
    content: 'any_content',
    createdAt: new Date('2022-12-12'),
    recipientPartyId: 'd5e4c4e4-6844-4c5b-8304-ec64ecfe8011',
    ...props,
  });
};
