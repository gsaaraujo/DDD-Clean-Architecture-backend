import { any, mock } from 'jest-mock-extended';

import { right } from '../../../core/helpers/either';
import { Agreement } from '../../domain/entities/agreement';
import { OwingItem } from '../../domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '../../domain/entities/party-consent';

import { CancelAnAgreementUsecase } from './cancel-an-agreement-usecase';
import { INotifyPartiesUsecase } from '../../domain/usecases/notify-parties-usecase';

import { FakeAgreementRepository } from '../../infra/repositories/fake/fake-agreement-repository';

import { AgreementNotFoundError } from '../errors/agreement-not-found-error';

describe('cancel-an-agreement-usecase', () => {
  let cancelAnAgreementUsecase: CancelAnAgreementUsecase;

  let mockNotifyPartiesUsecase: INotifyPartiesUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    mockNotifyPartiesUsecase = mock<INotifyPartiesUsecase>();
    fakeAgreementRepository = new FakeAgreementRepository();

    cancelAnAgreementUsecase = new CancelAnAgreementUsecase(
      mockNotifyPartiesUsecase,
      fakeAgreementRepository,
    );
  });

  it('should cancel an agreement and notify the parties', async () => {
    const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: 'any_creditor_party_id',
      createdAt: new Date(),
      owingItem: OwingItem.reconstitute({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
        status: PartyConsentStatus.ACCEPTED,
      }),
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
        status: PartyConsentStatus.ACCEPTED,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartiesUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartiesUsecase.execute).toHaveBeenCalledTimes(1);
    expect(mockNotifyPartiesUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content: any(),
      debtorPartyId: '5bbeec93-1049-4209-88ef-195f5acb28bc',
      creditorPartyId: 'any_creditor_party_id',
    });
    expect(fakeAgreementRepository.updateCalledTimes).toBe(1);
    expect(fakeAgreementRepository.findByIdAndPartyIdCalledTimes).toBe(1);
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
      creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
        status: PartyConsentStatus.PENDING,
      }),
      debtorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
        status: PartyConsentStatus.PENDING,
      }),
    });

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      agreementId: 'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });
});
