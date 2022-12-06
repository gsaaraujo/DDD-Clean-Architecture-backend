export interface INotificationService {
  notifyParties(creditorPartyId: string, debtorPartyId: string): Promise<void>;
}
