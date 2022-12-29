import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/entities/party-consent';

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
    const fakeAgreement = Agreement.reconstitute('any_agreement_id', {
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await getAgreementsUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual([fakeAgreement]);
  });

  it('should get a empty list of agreements', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await getAgreementsUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual([]);
  });

  it('shold return PartyNotFoundError if party was not found', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await getAgreementsUsecase.execute({
      partyId: '6760eff7-9e96-44c6-828f-34e490a7df27',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });
});
