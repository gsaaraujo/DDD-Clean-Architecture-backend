/* eslint-disable @typescript-eslint/no-unused-vars */

import { Either, left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  INotifyPartiesUsecase,
  NotifyPartiesUsecaseInput,
} from '@agreements/domain/usecases/notify-parties-usecase';
import { Notification } from '@agreements/domain/entities/notification';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';
import { INotificationService } from '@agreements/adapters/services/notification-service';
import { INotificationRepository } from '@agreements/adapters/repositories/notification-repository';

export class NotifyPartiesUsecase implements INotifyPartiesUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(
    input: NotifyPartiesUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, void>> {
    const [creditorExists, debtorExists] = await Promise.all([
      this.partyRepository.exists(input.creditorPartyId),
      this.partyRepository.exists(input.debtorPartyId),
    ]);

    if (!creditorExists || !debtorExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const recipientPartyIds: string[] = [input.creditorPartyId, input.debtorPartyId];

    for (const recipientPartyId of recipientPartyIds) {
      const notificationOrError = Notification.create({
        recipientPartyId: recipientPartyId,
        title: input.title,
        content: input.content,
      });

      if (notificationOrError.isLeft()) {
        const error = notificationOrError.value;
        return left(error);
      }

      const notification = notificationOrError.value;

      await this.notificationRepository.create({
        title: notification.title,
        readAt: notification.readAt,
        content: notification.content,
        createdAt: notification.createdAt,
        recipientPartyId: notification.recipientPartyId,
      });

      this.notificationService.send({
        recipientPartyId: recipientPartyId,
        title: input.title,
        content: input.content,
      });
    }

    return right(undefined);
  }
}
