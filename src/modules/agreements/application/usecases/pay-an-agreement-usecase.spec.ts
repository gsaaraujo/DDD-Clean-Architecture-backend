import { any, mock } from 'jest-mock-extended';

import { left, right } from '@core/domain/helpers/either';
import { BaseError } from '@core/domain/errors/base-error';
import { MockBaseError } from '@core/domain/errors/mocks/mock-base-error';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/entities/party-consent';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { PayAnAgreementUsecase } from '@agreements/application/usecases/pay-an-agreement-usecase';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('pay-an-agreement-usecase', () => {
  let payAnAgreementUsecase: PayAnAgreementUsecase;

  let mockNotifyPartyUsecase: INotifyPartyUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    mockNotifyPartyUsecase = mock<INotifyPartyUsecase>();
    fakeAgreementRepository = new FakeAgreementRepository();

    payAnAgreementUsecase = new PayAnAgreementUsecase(
      mockNotifyPartyUsecase,
      fakeAgreementRepository,
    );
  });

  it('should pay an agreement as creditor and notify the debtor', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await payAnAgreementUsecase.execute({
      partyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'The creditor 0e9f8d3b-4c66-49b0-b739-d443b15e1f4e has paid his part of the agreement.',
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
    });
  });

  it('should pay an agreement as debtor and notify the creditor', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await payAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'The debtor 5bbeec93-1049-4209-88ef-195f5acb28bc has paid his part of the agreement.',
      partyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
    });
  });

  it('should return AgreementNotFoundError if agreement was not found', async () => {
    const fakeAgreement = Agreement.reconstitute('21e9856b-8fef-47d9-94b7-88d3402bcd23', {
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: 'any_creditor_party_id',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await payAnAgreementUsecase.execute({
      partyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return an error if the payment of the agreement by the creditor fails', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.PENDING,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.PENDING,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await payAnAgreementUsecase.execute({
      partyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(BaseError);
  });

  it('should return an error if the payment of the agreement by the debtor fails', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.PENDING,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.PENDING,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await payAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(BaseError);
  });

  it('should return an error if the creation of the notification fails', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: '0e9f8d3b-4c66-49b0-b739-d443b15e1f4e',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_id', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(left(new MockBaseError()));

    const sut = await payAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(BaseError);
  });
});
