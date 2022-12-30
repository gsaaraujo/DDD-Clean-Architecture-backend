import { makeAgreement } from '@agreements/domain/factories/agreement-factory';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('GetAgreementsUsecase', () => {
  let getAgreementsUsecase: GetAgreementsUsecase;
  let fakePartyRepository: FakePartyRepository;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    fakeAgreementRepository = new FakeAgreementRepository();

    getAgreementsUsecase = new GetAgreementsUsecase(fakePartyRepository, fakeAgreementRepository);
  });

  it('should get agreements', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await getAgreementsUsecase.execute({
      partyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual([fakeAgreement]);
  });

  it('should get a empty list of agreements', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await getAgreementsUsecase.execute({
      partyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual([]);
  });

  it('shold return PartyNotFoundError if party was not found', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await getAgreementsUsecase.execute({
      partyId: '6760eff7-9e96-44c6-828f-34e490a7df27',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });
});
