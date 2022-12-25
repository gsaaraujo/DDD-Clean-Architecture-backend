/* eslint-disable @typescript-eslint/no-unused-vars */

import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors/domain-error';
import { ApplicationError } from '../../../shared/helpers/errors/application-error';

import { Notification } from '../../domain/entities/notification';

import {
  INotifyPartiesUsecase,
  NotifyPartiesUsecaseInput,
} from '../../domain/usecases/notify-parties-usecase';

import { INotificationService } from '../../adapters/services/notification-service';

import { IPartyRepository } from '../../adapters/repositories/party-repository';
import { INotificationRepository } from '../../adapters/repositories/notification-repository';

import { DebtorPartyNotFoundError } from '../errors/debtor-party-not-found-error';
import { CreditorPartyNotFoundError } from '../errors/creditor-party-not-found-error';

export class NotifyPartiesUsecase implements INotifyPartiesUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(
    input: NotifyPartiesUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, void>> {
    const doesCreditorPartyExists: boolean = await this.partyRepository.exists(
      input.creditorPartyId,
    );

    if (!doesCreditorPartyExists) {
      const error = new CreditorPartyNotFoundError('Creditor party not found');
      return left(error);
    }

    const doesDebtorPartyExists: boolean = await this.partyRepository.exists(input.debtorPartyId);

    if (!doesDebtorPartyExists) {
      const error = new DebtorPartyNotFoundError('Debtor party not found');
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
