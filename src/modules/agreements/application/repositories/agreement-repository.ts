import { Agreement } from '../../domain/entities/agreement';

export type AgreementDTO = Agreement;

export interface IAgreementRepository {
  exists(id: string): Promise<boolean>;
  create(agreement: AgreementDTO): Promise<AgreementDTO>;
  findById(id: string): Promise<AgreementDTO | null>;
  delete(id: string): Promise<void>;
}
