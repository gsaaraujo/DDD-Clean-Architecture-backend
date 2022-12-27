import { Agreement } from '@agreements/domain/entities/agreement';

export type AgreementDTO = Agreement;

export interface IAgreementRepository {
  exists(id: string): Promise<boolean>;
  create(agreement: AgreementDTO): Promise<AgreementDTO>;
  update(agreement: AgreementDTO): Promise<AgreementDTO | null>;
  findById(id: string): Promise<AgreementDTO | null>;
  findByIdAndPartyId(id: string, partyId: string): Promise<AgreementDTO | null>;
  findAllByPartyId(partyId: string): Promise<AgreementDTO[]>;
  delete(id: string): Promise<boolean>;
}
