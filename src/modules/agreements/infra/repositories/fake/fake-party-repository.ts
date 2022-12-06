import { IPartyRepository, PartyDTO } from '../../../application/repositories/party-repository';

export class FakePartyRepository implements IPartyRepository {
  public existsCalledTimes = 0;
  public parties: PartyDTO[] = [];

  async exists(id: string): Promise<boolean> {
    this.existsCalledTimes += 1;

    const party: PartyDTO | undefined = this.parties.find((party) => party.id === id);
    return !!party;
  }
}
