import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/entities/party-consent';
import { makeAgreement } from '@agreements/domain/factories/agreement-factory';

describe('agreement-factory', () => {
  it('should create an agreement with default values', () => {
    const fakeAgreement = Agreement.reconstitute('9f3a766c-eb64-4b6b-91a1-36b4b501476e', {
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      createdAt: new Date('2022-12-12'),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
      }),
      creditorPartyConsent: PartyConsent.reconstitute('713ad656-c1e9-4895-842c-0f1ee8138e65', {
        status: PartyConsentStatus.PENDING,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('597fe0fa-8f6a-4240-b054-adcd9f1f0415', {
        status: PartyConsentStatus.PENDING,
      }),
    });

    const sut = makeAgreement();

    expect(sut).toStrictEqual(fakeAgreement);
  });

  it('should create an agreement with override creditorPartyConsent value', () => {
    const fakeAgreement = Agreement.reconstitute('9f3a766c-eb64-4b6b-91a1-36b4b501476e', {
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      createdAt: new Date('2022-12-12'),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
      }),
      creditorPartyConsent: PartyConsent.reconstitute('713ad656-c1e9-4895-842c-0f1ee8138e65', {
        status: PartyConsentStatus.PAID,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('597fe0fa-8f6a-4240-b054-adcd9f1f0415', {
        status: PartyConsentStatus.PENDING,
      }),
    });

    const sut = makeAgreement({
      creditorPartyConsent: PartyConsent.reconstitute('713ad656-c1e9-4895-842c-0f1ee8138e65', {
        status: PartyConsentStatus.PAID,
      }),
    });

    expect(sut).toStrictEqual(fakeAgreement);
  });
});
