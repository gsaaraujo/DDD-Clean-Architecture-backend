import { makePartyConsent } from '@agreements/domain/factories/party-consent-factory';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';

describe('party-consent-factory', () => {
  it('should create a party consent with default values', () => {
    const fakeNotification = PartyConsent.reconstitute({
      status: PartyConsentStatus.PENDING,
    });

    const sut = makePartyConsent();

    expect(sut).toStrictEqual(fakeNotification);
  });

  it('should create a party consent with override title value', () => {
    const fakeNotification = PartyConsent.reconstitute({
      status: PartyConsentStatus.DENIED,
    });

    const sut = makePartyConsent({ status: PartyConsentStatus.DENIED });

    expect(sut).toStrictEqual(fakeNotification);
  });
});
