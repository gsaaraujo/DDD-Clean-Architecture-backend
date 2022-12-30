import { Notification } from '@agreements/domain/entities/notification';
import { makeNotification } from '@agreements/domain/factories/notification-factory';

describe('notification-factory', () => {
  it('should create a notification with default values', () => {
    const fakeNotification = Notification.reconstitute('64499f96-dcdd-4d34-9996-06c5dfe0f05b', {
      readAt: null,
      title: 'any_title',
      content: 'any_content',
      createdAt: new Date('2022-12-12'),
      recipientPartyId: 'd5e4c4e4-6844-4c5b-8304-ec64ecfe8011',
    });

    const sut = makeNotification();

    expect(sut).toStrictEqual(fakeNotification);
  });

  it('should create a notification with override title value', () => {
    const fakeNotification = Notification.reconstitute('64499f96-dcdd-4d34-9996-06c5dfe0f05b', {
      readAt: null,
      title: 'congrats',
      content: 'any_content',
      createdAt: new Date('2022-12-12'),
      recipientPartyId: 'd5e4c4e4-6844-4c5b-8304-ec64ecfe8011',
    });

    const sut = makeNotification({ title: 'congrats' });

    expect(sut).toStrictEqual(fakeNotification);
  });
});
