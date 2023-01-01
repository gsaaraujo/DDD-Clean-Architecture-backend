import { any, mock } from 'jest-mock-extended';

import { left, right } from '@core/domain/helpers/either';
import { BaseError } from '@core/domain/errors/base-error';
import { DomainError } from '@core/domain/errors/domain-error';
import { MockBaseError } from '@core/domain/errors/mocks/mock-base-error';
import { makePartyConsent } from '@agreements/domain/factories/party-consent-factory';

import { makeAgreement } from '@agreements/domain/factories/agreement-factory';
import { PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { DenyAnAgreementUsecase } from '@agreements/application/usecases/deny-an-agreement-usecase';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('deny-an-agreement-usecase', () => {
  let denyAnAgreementUsecase: DenyAnAgreementUsecase;

  let mockNotifyPartyUsecase: INotifyPartyUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    mockNotifyPartyUsecase = mock<INotifyPartyUsecase>();
    fakeAgreementRepository = new FakeAgreementRepository();

    denyAnAgreementUsecase = new DenyAnAgreementUsecase(
      mockNotifyPartyUsecase,
      fakeAgreementRepository,
    );
  });

  it('should deny an agreement as creditor and notify the debtor', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await denyAnAgreementUsecase.execute({
      partyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'The creditor 331c6804-cd7d-420e-b8b8-50fcc5201e32 has denied his part of the agreement.',
      partyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
    });
  });

  it('should deny an agreement as debtor and notify the creditor', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await denyAnAgreementUsecase.execute({
      partyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'The debtor b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5 has denied his part of the agreement.',
      partyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
    });
  });

  it('should return AgreementNotFoundError if agreement was not found', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await denyAnAgreementUsecase.execute({
      partyId: 'efb26144-e2ea-4737-82e2-710877961d2e',
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return an error if the denyance of the agreement by the creditor fails', async () => {
    const fakeAgreement = makeAgreement({
      creditorPartyConsent: makePartyConsent({ status: PartyConsentStatus.DENIED }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await denyAnAgreementUsecase.execute({
      partyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if the denyance of the agreement by the debtor fails', async () => {
    const fakeAgreement = makeAgreement({
      debtorPartyConsent: makePartyConsent({ status: PartyConsentStatus.DENIED }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await denyAnAgreementUsecase.execute({
      partyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if sending notification fails', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(left(new MockBaseError()));

    const sut = await denyAnAgreementUsecase.execute({
      partyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(BaseError);
  });
});
