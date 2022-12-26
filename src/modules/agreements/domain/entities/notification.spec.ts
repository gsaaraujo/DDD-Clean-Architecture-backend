import crypto from 'crypto';

import { Notification } from '@agreements/domain/entities/notification';
import { CharactersLimitError } from '@agreements/domain/errors/characters-limit-error';

describe('Notification', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a notification', () => {
    const fakeNotificationCreatedAt = new Date();
    const fakeNotificationId = crypto.randomUUID();

    const fakeNotification: Notification = Notification.reconstitute(fakeNotificationId, {
      readAt: null,
      title: 'any_title',
      content: 'any_content',
      createdAt: fakeNotificationCreatedAt,
      recipientPartyId: 'any_recipient_party_id',
    });

    jest.spyOn(crypto, 'randomUUID').mockReturnValueOnce(fakeNotificationId);
    jest.spyOn(global as any, 'Date').mockReturnValueOnce(fakeNotificationCreatedAt);

    const sut = Notification.create({
      title: 'any_title',
      content: 'any_content',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual(fakeNotification);
  });

  it('should mark a notification as read', () => {
    const fakeNotificationReadAt = new Date();

    const fakeNotification: Notification = Notification.reconstitute('any_notification_id', {
      readAt: null,
      title: 'any_title',
      content: 'any_content',
      createdAt: new Date(),
      recipientPartyId: 'any_recipient_party_id',
    });

    jest.spyOn(global as any, 'Date').mockReturnValueOnce(fakeNotificationReadAt);

    const sut = fakeNotification.hasBeenRead();

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
    expect(fakeNotification.readAt).toBe(fakeNotificationReadAt);
  });

  it('should return CharactersLimitError if title is less than 3 characters', () => {
    const sut = Notification.create({
      title: 'ab',
      content: 'any_content',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });

  it('should return CharactersLimitError if title is greater than 80 characters', () => {
    const sut = Notification.create({
      title: 'abc'.repeat(80),
      content: 'any_content',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });

  it('should return CharactersLimitError if content is less than 3 characters', () => {
    const sut = Notification.create({
      title: 'any_title',
      content: 'ab',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });

  it('should return CharactersLimitError if content is greater than 160 characters', () => {
    const sut = Notification.create({
      title: 'any_title',
      content: 'abc'.repeat(80),
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });
});
