export type PartyDTO = {
  id: string;
  registrationToken: string;
};

export interface IPartyRepository {
  exists(id: string): Promise<boolean>;
  create(partyDTO: PartyDTO): Promise<PartyDTO>;
  findOneRegistrationTokenByPartyId(partyId: string): Promise<string | null>;
}
