export type PartyDTO = {
  id: string;
};

export interface IPartyRepository {
  exists(id: string): Promise<boolean>;
}
