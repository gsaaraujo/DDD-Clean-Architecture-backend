import { Agreement } from '../../../../agreements/domain/entities/agreement';

import {
  AgreementDTO,
  IAgreementRepository,
} from '../../../application/repositories/agreement-repository';

export class FakeAgreementRepository implements IAgreementRepository {
  public existsCalledTimes = 0;
  public createCalledTimes = 0;
  public updateCalledTimes = 0;
  public deleteCalledTimes = 0;
  public findByIdCalledTimes = 0;
  public findAllByPartyIdCalledTimes = 0;
  public findByIdAndPartyIdCalledTimes = 0;

  public agreements: AgreementDTO[] = [];

  public async exists(id: string): Promise<boolean> {
    this.existsCalledTimes += 1;

    const agreement = this.agreements.find((agreement) => agreement.id === id);
    return !!agreement;
  }

  public async create(agreement: AgreementDTO): Promise<AgreementDTO> {
    this.createCalledTimes += 1;

    this.agreements.push(agreement);
    return agreement;
  }

  public async findById(id: string): Promise<Agreement | null> {
    this.findByIdCalledTimes += 1;

    const agreement = this.agreements.find((agreement) => agreement.id === id);

    if (!agreement) return null;
    return agreement;
  }

  public async findAllByPartyId(partyId: string): Promise<Agreement[]> {
    this.findAllByPartyIdCalledTimes += 1;

    const agreements = this.agreements.filter(
      (agreement) => agreement.creditorPartyId === partyId || agreement.debtorPartyId === partyId,
    );

    return agreements;
  }

  public async findByIdAndPartyId(id: string, partyId: string): Promise<Agreement | null> {
    this.findByIdAndPartyIdCalledTimes += 1;

    const agreement = this.agreements.find(
      (agreement) =>
        agreement.id === id &&
        (agreement.creditorPartyId === partyId || agreement.debtorPartyId === partyId),
    );

    if (!agreement) return null;
    return agreement;
  }

  public async update(newAgreement: Agreement): Promise<Agreement | null> {
    this.updateCalledTimes += 1;

    const agreementIndex = this.agreements.findIndex(
      (agreement) => agreement.id === newAgreement.id,
    );

    this.agreements[agreementIndex] = newAgreement;
    if (!agreementIndex) return null;
    return newAgreement;
  }

  public async delete(id: string): Promise<void> {
    this.deleteCalledTimes += 1;

    const newAgreements = this.agreements.filter((agreement) => agreement.id !== id);
    this.agreements = newAgreements;
  }
}
