import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';

export class FakePartyRepository implements IPartyRepository {
  public partiesIds: string[] = [];

  async exists(id: string): Promise<boolean> {
    return this.partiesIds.includes(id);
  }
}
