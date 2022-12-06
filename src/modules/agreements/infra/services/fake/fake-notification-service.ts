/* eslint-disable @typescript-eslint/no-unused-vars */

import { INotificationService } from 'src/modules/agreements/application/services/notification-service';

export class FakeNotificationService implements INotificationService {
  public notifyPartiesCalledTimes = 0;

  async notifyParties(creditorPartyId: string, debtorPartyId: string): Promise<void> {
    this.notifyPartiesCalledTimes += 1;

    return;
  }
}
