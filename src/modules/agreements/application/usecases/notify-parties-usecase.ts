/* eslint-disable @typescript-eslint/no-unused-vars */

import { Either, left, right } from '../../../core/helpers/either';
import { DomainError } from '../../../core/helpers/errors/domain-error';
import { ApplicationError } from '../../../core/helpers/errors/application-error';
import { IVerifyPartyExistsUsecase } from '../../../core/domain/usecases/verify-party-exists-usecase';

import { Notification } from '../../domain/entities/notification';

import {
  INotifyPartiesUsecase,
  NotifyPartiesUsecaseInput,
} from '../../domain/usecases/notify-parties-usecase';

import { INotificationService } from '../../adapters/services/notification-service';

import { INotificationRepository } from '../../adapters/repositories/notification-repository';

export class NotifyPartiesUsecase implements INotifyPartiesUsecase {
  public constructor(
    private readonly verifyPartyExistsUsecase: IVerifyPartyExistsUsecase,
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(
    input: NotifyPartiesUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, void>> {
    await this.verifyPartyExistsUsecase.execute({ partyId: input.debtorPartyId });
    await this.verifyPartyExistsUsecase.execute({ partyId: input.creditorPartyId });

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
