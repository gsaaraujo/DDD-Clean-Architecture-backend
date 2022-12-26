import { any, mock } from 'jest-mock-extended';

import { right } from '../../../shared/helpers/either';
import { IVerifyPartyExistsUsecase } from '../../../shared/domain/usecases/verify-party-exists-usecase';

import { MakeAnAgreementUsecase } from './make-an-agreement-usecase';

import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { FakeAgreementRepository } from '../../infra/repositories/fake/fake-agreement-repository';

describe('MakeAnAgreementUsecase', () => {
  let makeAnAgreementUsecase: MakeAnAgreementUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;
  let mockNotifyPartiesUsecase: INotifyPartiesUsecase;
  let mockVerifyPartyExistsUsecase: IVerifyPartyExistsUsecase;

  beforeEach(() => {
    mockNotifyPartiesUsecase = mock<INotifyPartiesUsecase>();
    mockVerifyPartyExistsUsecase = mock<IVerifyPartyExistsUsecase>();
    fakeAgreementRepository = new FakeAgreementRepository();

    makeAnAgreementUsecase = new MakeAnAgreementUsecase(
      mockVerifyPartyExistsUsecase,
      mockNotifyPartiesUsecase,
      fakeAgreementRepository,
    );
  });

  it('should make an agreement and notify parties', async () => {
    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'any_creditor_party_id',
    });

    jest.spyOn(mockNotifyPartiesUsecase, 'execute').mockResolvedValueOnce(right(undefined));
    jest.spyOn(mockVerifyPartyExistsUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(fakeAgreementRepository.agreements.length).toBe(1);
    expect(fakeAgreementRepository.createCalledTimes).toBe(1);

    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledWith({
      partyId: 'any_debtor_party_id',
    });
    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledWith({
      partyId: 'any_creditor_party_id',
    });
    expect(mockNotifyPartiesUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content: any(),
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'any_creditor_party_id',
    });
  });

  it('should make an agreement and notify parties', async () => {
    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'any_creditor_party_id',
    });

    jest.spyOn(mockNotifyPartiesUsecase, 'execute').mockResolvedValueOnce(right(undefined));
    jest.spyOn(mockVerifyPartyExistsUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(fakeAgreementRepository.agreements.length).toBe(1);
    expect(fakeAgreementRepository.createCalledTimes).toBe(1);

    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledWith({
      partyId: 'any_debtor_party_id',
    });
    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledWith({
      partyId: 'any_creditor_party_id',
    });
    expect(mockNotifyPartiesUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content: any(),
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'any_creditor_party_id',
    });
  });
});
