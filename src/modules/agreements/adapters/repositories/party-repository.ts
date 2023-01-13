export type PartyDTO = {
  id: string;
  registrationToken: string;
};

export interface IPartyRepository {
  exists(id: string): Promise<boolean>;
  create(partyDTO: PartyDTO): Promise<PartyDTO>;
  findRegistrationTokenByPartyId(partyId: string): Promise<string | null>;
}
