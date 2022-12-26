import { IPartyRepository } from '@core/adapters/repositories/party-repository';

export class FakePartyRepository implements IPartyRepository {
  public existsCalledTimes = 0;
  public partiesIds: string[] = [];

  async exists(id: string): Promise<boolean> {
    this.existsCalledTimes += 1;
    return this.partiesIds.includes(id);
  }
}
