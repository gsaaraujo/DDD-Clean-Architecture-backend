import { PartyConsent, PartyConsentStatus } from './party-consent';
import { CurrentStatusMustBePendingError } from '../errors/current-status-must-be-pending-error';
import { CurrentStatusMustBeAcceptedError } from '../errors/current-status-must-be-accepted-error';

describe('PartyConsent', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create PartyConsent', () => {
    const sut = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED });

    expect(sut).toBeInstanceOf(PartyConsent);
  });

  it('should reconstitute PartyConsent', () => {
    const sut = PartyConsent.reconstitute('d7d2be15-34d8-43b8-9593-0d2df52c85c4', {
      status: PartyConsentStatus.ACCEPTED,
    });

    expect(sut).toBeInstanceOf(PartyConsent);
  });

  it('should accept agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.PENDING });

    const sut = fakePartyConsent.acceptAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.ACCEPTED);
  });

  it('should deny agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.PENDING });

    const sut = fakePartyConsent.denyAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.DENIED);
  });

  it('should cancel agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED });

    const sut = fakePartyConsent.cancelAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.CANCELED);
  });

  it('should paid agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED });

    const sut = fakePartyConsent.payAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.PAID);
  });

  it('should return CurrentStatusMustBePendingError when accept agreement and the current PartyConsentStatus is not "PENDING"', () => {
    const fakePartyConsent1 = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED });
    const fakePartyConsent2 = PartyConsent.create({ status: PartyConsentStatus.DENIED });
    const fakePartyConsent3 = PartyConsent.create({ status: PartyConsentStatus.CANCELED });
    const fakePartyConsent4 = PartyConsent.create({ status: PartyConsentStatus.PAID });

    const sut1 = fakePartyConsent1.acceptAgreement();
    const sut2 = fakePartyConsent2.acceptAgreement();
    const sut3 = fakePartyConsent3.acceptAgreement();
    const sut4 = fakePartyConsent4.acceptAgreement();

    expect(sut1.isLeft()).toBeTruthy();
    expect(sut1.value).toBeInstanceOf(CurrentStatusMustBePendingError);

    expect(sut2.isLeft()).toBeTruthy();
    expect(sut2.value).toBeInstanceOf(CurrentStatusMustBePendingError);

    expect(sut3.isLeft()).toBeTruthy();
    expect(sut3.value).toBeInstanceOf(CurrentStatusMustBePendingError);

    expect(sut4.isLeft()).toBeTruthy();
    expect(sut4.value).toBeInstanceOf(CurrentStatusMustBePendingError);
  });

  it('should return CurrentStatusMustBePendingError when deny agreement and the current PartyConsentStatus is not "PENDING"', () => {
    const fakePartyConsent1 = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED });
    const fakePartyConsent2 = PartyConsent.create({ status: PartyConsentStatus.DENIED });
    const fakePartyConsent3 = PartyConsent.create({ status: PartyConsentStatus.CANCELED });
    const fakePartyConsent4 = PartyConsent.create({ status: PartyConsentStatus.PAID });

    const sut1 = fakePartyConsent1.denyAgreement();
    const sut2 = fakePartyConsent2.denyAgreement();
    const sut3 = fakePartyConsent3.denyAgreement();
    const sut4 = fakePartyConsent4.denyAgreement();

    expect(sut1.isLeft()).toBeTruthy();
    expect(sut1.value).toBeInstanceOf(CurrentStatusMustBePendingError);

    expect(sut2.isLeft()).toBeTruthy();
    expect(sut2.value).toBeInstanceOf(CurrentStatusMustBePendingError);

    expect(sut3.isLeft()).toBeTruthy();
    expect(sut3.value).toBeInstanceOf(CurrentStatusMustBePendingError);

    expect(sut4.isLeft()).toBeTruthy();
    expect(sut4.value).toBeInstanceOf(CurrentStatusMustBePendingError);
  });

  it('should return CurrentStatusMustBeAcceptedError when cancel agreement and the current PartyConsentStatus is not "ACCEPTED"', () => {
    const fakePartyConsent1 = PartyConsent.create({ status: PartyConsentStatus.PENDING });
    const fakePartyConsent2 = PartyConsent.create({ status: PartyConsentStatus.DENIED });
    const fakePartyConsent3 = PartyConsent.create({ status: PartyConsentStatus.CANCELED });
    const fakePartyConsent4 = PartyConsent.create({ status: PartyConsentStatus.PAID });

    const sut1 = fakePartyConsent1.cancelAgreement();
    const sut2 = fakePartyConsent2.cancelAgreement();
    const sut3 = fakePartyConsent3.cancelAgreement();
    const sut4 = fakePartyConsent4.cancelAgreement();

    expect(sut1.isLeft()).toBeTruthy();
    expect(sut1.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);

    expect(sut2.isLeft()).toBeTruthy();
    expect(sut2.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);

    expect(sut3.isLeft()).toBeTruthy();
    expect(sut3.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);

    expect(sut4.isLeft()).toBeTruthy();
    expect(sut4.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);
  });

  it('should return CurrentStatusMustBeAcceptedError when paid agreement and the current PartyConsentStatus is not "ACCEPTED"', () => {
    const fakePartyConsent1 = PartyConsent.create({ status: PartyConsentStatus.PENDING });
    const fakePartyConsent2 = PartyConsent.create({ status: PartyConsentStatus.DENIED });
    const fakePartyConsent3 = PartyConsent.create({ status: PartyConsentStatus.CANCELED });
    const fakePartyConsent4 = PartyConsent.create({ status: PartyConsentStatus.PAID });

    const sut1 = fakePartyConsent1.payAgreement();
    const sut2 = fakePartyConsent2.payAgreement();
    const sut3 = fakePartyConsent3.payAgreement();
    const sut4 = fakePartyConsent4.payAgreement();

    expect(sut1.isLeft()).toBeTruthy();
    expect(sut1.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);

    expect(sut2.isLeft()).toBeTruthy();
    expect(sut2.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);

    expect(sut3.isLeft()).toBeTruthy();
    expect(sut3.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);

    expect(sut4.isLeft()).toBeTruthy();
    expect(sut4.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);
  });
});
