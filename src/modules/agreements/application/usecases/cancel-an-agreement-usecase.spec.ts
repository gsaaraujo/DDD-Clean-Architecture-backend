import { CancelAnAgreementUsecase } from './cancel-an-agreement-usecase';

import { Agreement } from '../../domain/entities/agreement';
import { OwingItem } from '../../domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '../../domain/entities/party-consent';

import { FakeNotificationService } from '../../infra/services/fake/fake-notification-service';

import { FakePartyRepository } from '../../infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '../../infra/repositories/fake/fake-agreement-repository';

import { PartyNotFoundError } from '../errors/party-not-found-error';
import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

describe('CancelAnAgreementUsecase', () => {
  let cancelAnAgreementUsecase: CancelAnAgreementUsecase;
  let fakePartyRepository: FakePartyRepository;
  let fakeAgreementRepository: FakeAgreementRepository;
  let fakeNotificationService: FakeNotificationService;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    fakeAgreementRepository = new FakeAgreementRepository();
    fakeNotificationService = new FakeNotificationService();

    cancelAnAgreementUsecase = new CancelAnAgreementUsecase(
      fakePartyRepository,
      fakeAgreementRepository,
      fakeNotificationService,
    );
  });

  it('should cancel an agreement and notify the parties', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
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
      { id: '9c491d19-cbb6-483c-904b-af83bb0a4bbd' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
    expect(fakePartyRepository.existsCalledTimes).toBe(1);
    expect(fakeAgreementRepository.updateCalledTimes).toBe(1);
    expect(fakeNotificationService.notifyPartiesCalledTimes).toBe(1);
    expect(fakeAgreementRepository.findByIdAndPartyIdCalledTimes).toBe(1);
    expect(fakeAgreementRepository.agreements[0].debtorPartyConsent.status).toStrictEqual(
      PartyConsentStatus.CANCELED,
    );
  });

  it('should return PartyNotFoundError if party was not found', async () => {
    fakePartyRepository.parties.push(
      { id: '9c491d19-cbb6-483c-904b-af83bb0a4bbd' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return AgreementNotFoundError if agreement was not found', async () => {
    const fakeAgreement = Agreement.reconstitute('21e9856b-8fef-47d9-94b7-88d3402bcd23', {
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('713ad656-c1e9-4895-842c-0f1ee8138e65', {
        status: PartyConsentStatus.PENDING,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('597fe0fa-8f6a-4240-b054-adcd9f1f0415', {
        status: PartyConsentStatus.PENDING,
      }),
    });

    fakeAgreementRepository.agreements = [fakeAgreement];

    fakePartyRepository.parties.push(
      { id: '9c491d19-cbb6-483c-904b-af83bb0a4bbd' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });
});
