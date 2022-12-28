import { Agreement } from '@agreements/domain/entities/agreement';

import {
  AgreementDTO,
  IAgreementRepository,
} from '@agreements/adapters/repositories/agreement-repository';

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

  public async update(updatedAgreement: Agreement): Promise<Agreement | null> {
    this.updateCalledTimes += 1;

    const agreementIndex = this.agreements.findIndex(
      (agreement) => agreement.id === updatedAgreement.id,
    );

    if (agreementIndex === -1) return null;
    this.agreements[agreementIndex] = updatedAgreement;
    return updatedAgreement;
  }

  public async delete(id: string): Promise<boolean> {
    this.deleteCalledTimes += 1;

    const agreementIndex = this.agreements.findIndex((agreement) => agreement.id === id);

    if (agreementIndex === -1) return false;
    this.agreements.splice(agreementIndex, 1);
    return true;
  }
}
