import { Agreement } from '../../domain/entities/agreement';

export type AgreementDTO = Agreement;

export interface IAgreementRepository {
  create(agreement: AgreementDTO): Promise<AgreementDTO>;
}
