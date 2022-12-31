import { Agreement } from '@agreements/domain/entities/agreement';

export interface IAgreementRepository {
  exists(id: string): Promise<boolean>;
  create(agreement: Agreement): Promise<Agreement>;
  update(agreement: Agreement): Promise<Agreement | null>;
  findById(id: string): Promise<Agreement | null>;
  findByIdAndPartyId(id: string, partyId: string): Promise<Agreement | null>;
  findAllByPartyId(partyId: string): Promise<Agreement[]>;
  delete(id: string): Promise<boolean>;
}
