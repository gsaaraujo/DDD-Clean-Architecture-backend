import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import { CreditorAndDebtorCannotBeTheSameError } from '@agreements/domain/errors/creditor-and-debtor-cannot-be-the-same-error';

describe('Agreement', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create Agreement', () => {
    const sut = Agreement.create({
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      owingItem: OwingItem.create({
        amount: 2,
        isCurrency: false,
        description: 'any description',
      }).value as OwingItem,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Agreement);
  });

  it('should reconstitute Agreement', () => {
    const sut = Agreement.reconstitute('9f3a766c-eb64-4b6b-91a1-36b4b501476e', {
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute({
        status: PartyConsentStatus.ACCEPTED,
      }),
      debtorPartyConsent: PartyConsent.reconstitute({
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    expect(sut).toBeInstanceOf(Agreement);
  });

  it('should return CreditorAndDebtorCannotBeTheSameError if creditor and debtor are the same', () => {
    const sut = Agreement.create({
      debtorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      owingItem: OwingItem.create({
        amount: 2,
        isCurrency: false,
        description: 'any description',
      }).value as OwingItem,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CreditorAndDebtorCannotBeTheSameError);
  });
});
