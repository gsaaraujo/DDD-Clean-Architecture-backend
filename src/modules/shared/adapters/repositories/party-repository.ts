export interface IPartyRepository {
  exists(id: string): Promise<boolean>;
}
