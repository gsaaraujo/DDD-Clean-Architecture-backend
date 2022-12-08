import { Agreement } from '../../domain/entities/agreement';
import { OwingItem } from '../../domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '../../domain/entities/party-consent';

import { RemoveAnAgreementUsecase } from './remove-an-agreement-usecase';

import { FakeAgreementRepository } from '../../infra/repositories/fake/fake-agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';
import { CannotRemoveAgreementError } from '../errors/cannot-remove-agreement-error';

describe('RemoveAnAgreementUsecase', () => {
  let removeAnAgreementUsecase: RemoveAnAgreementUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakeAgreementRepository = new FakeAgreementRepository();
    removeAnAgreementUsecase = new RemoveAnAgreementUsecase(fakeAgreementRepository);
  });

  it('should remove agreement', async () => {
    const fakeAgreement = Agreement.reconstitute('21e9856b-8fef-47d9-94b7-88d3402bcd23', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
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

    const sut = await removeAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: '21e9856b-8fef-47d9-94b7-88d3402bcd23',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
    expect(fakeAgreementRepository.agreements.length).toBe(0);
    expect(fakeAgreementRepository.deleteCalledTimes).toBe(1);
    expect(fakeAgreementRepository.findByIdAndPartyIdCalledTimes).toBe(1);
  });

  it('should return AgreementNotFoundError if agreement was not found', async () => {
    fakeAgreementRepository.agreements = [];

    const sut = await removeAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: '21e9856b-8fef-47d9-94b7-88d3402bcd23',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return CannotRemoveAgreementError if both creditor and debtor consent of the agreement are not pending', async () => {
    const fakeAgreement = Agreement.reconstitute('21e9856b-8fef-47d9-94b7-88d3402bcd23', {
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

    fakeAgreementRepository.agreements = [fakeAgreement];

    const sut = await removeAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: '21e9856b-8fef-47d9-94b7-88d3402bcd23',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CannotRemoveAgreementError);
  });
});
