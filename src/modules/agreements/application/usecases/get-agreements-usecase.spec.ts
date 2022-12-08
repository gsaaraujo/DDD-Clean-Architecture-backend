import { Agreement } from '../../domain/entities/agreement';
import { OwingItem } from '../../domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '../../domain/entities/party-consent';

import { GetAgreementsUsecase } from './get-agreements-usecase';

import { FakePartyRepository } from '../../infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '../../infra/repositories/fake/fake-agreement-repository';

import { PartyNotFoundError } from '../errors/party-not-found-error';

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
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('713ad656-c1e9-4895-842c-0f1ee8138e65', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('597fe0fa-8f6a-4240-b054-adcd9f1f0415', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    fakePartyRepository.parties.push(
      { id: '7e25135b-7ee3-447a-a722-aa81e0285b26' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await getAgreementsUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toEqual(expect.arrayContaining([fakeAgreement]));
    expect(fakePartyRepository.existsCalledTimes).toBe(1);
    expect(fakeAgreementRepository.findAllByPartyIdCalledTimes).toBe(1);
  });

  it('should return PartyNotFoundError if party was not found', async () => {
    fakePartyRepository.parties.push(
      { id: '9c491d19-cbb6-483c-904b-af83bb0a4bbd' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await getAgreementsUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });
});
