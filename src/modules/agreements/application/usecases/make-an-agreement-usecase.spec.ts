import { any, mock } from 'jest-mock-extended';

import { right } from '@core/domain/helpers/either';

import { INotifyPartiesUsecase } from '@agreements/domain/usecases/notify-parties-usecase';

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
      content: any(),
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });
  });
});
