import {
  AgreementDTO,
  IAgreementRepository,
} from '../../../application/repositories/agreement-repository';

export class FakeAgreementRepository implements IAgreementRepository {
  public createCalledTimes = 0;
  public agreements: AgreementDTO[] = [];

  public async create(agreement: AgreementDTO): Promise<AgreementDTO> {
    this.createCalledTimes += 1;

    this.agreements.push(agreement);
    return agreement;
  }
}
