import { any, mock } from 'jest-mock-extended';

import { left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { MockBaseError } from '@core/domain/errors/mocks/mock-base-error';

import { INotifyPartiesUsecase } from '@agreements/domain/usecases/notify-parties-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { MakeAnAgreementUsecase } from '@agreements/application/usecases/make-an-agreement-usecase';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('MakeAnAgreementUsecase', () => {
  let makeAnAgreementUsecase: MakeAnAgreementUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;
  let mockNotifyPartiesUsecase: INotifyPartiesUsecase;
  let fakePartyRepository: FakePartyRepository;

  beforeEach(() => {
    mockNotifyPartiesUsecase = mock<INotifyPartiesUsecase>();
    fakePartyRepository = new FakePartyRepository();
    fakeAgreementRepository = new FakeAgreementRepository();

    makeAnAgreementUsecase = new MakeAnAgreementUsecase(
      mockNotifyPartiesUsecase,
      fakePartyRepository,
      fakeAgreementRepository,
    );
  });

  it('should make an agreement and notify the parties', async () => {
    jest.spyOn(mockNotifyPartiesUsecase, 'execute').mockResolvedValueOnce(right(undefined));
    jest.spyOn(mockNotifyPartiesUsecase, 'execute').mockResolvedValueOnce(right(undefined));
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(fakeAgreementRepository.agreements.length).toBe(1);

    expect(mockNotifyPartiesUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'A agreement between a2adf2a3-0c0e-4e91-b131-6beb87b8af35 (creditor) and 3e41372f-1f25-4b4d-9a04-eafa55e0f259 (debtor) has been created.',
      partyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });
    expect(mockNotifyPartiesUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'A agreement between a2adf2a3-0c0e-4e91-b131-6beb87b8af35 (creditor) and 3e41372f-1f25-4b4d-9a04-eafa55e0f259 (debtor) has been created.',
      partyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
    });
  });

  it('should return PartyNotFoundError if the creditor was not found', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'a8c0a335-f410-4dad-a915-21691d617b6c',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return PartyNotFoundError if the debtor was not found', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '6fabf0ed-b15d-4ae0-8627-917faabada17',
      creditorPartyId: 'any_creditor_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return PartyNotFoundError if the creditor was not found', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'a8c0a335-f410-4dad-a915-21691d617b6c',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return an error if the creation of the owing item fails', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2.5,
      isCurrency: true,
      description: 'any_description',
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if the creation of the agreement fails', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if the sending of the notification fails', async () => {
    jest
      .spyOn(mockNotifyPartiesUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockBaseError()));

    jest.spyOn(mockNotifyPartiesUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
      creditorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(MockBaseError);
  });
});
