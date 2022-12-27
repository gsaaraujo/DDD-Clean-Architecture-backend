import { mock } from 'jest-mock-extended';

import { right } from '@core/helpers/either';

import { IVerifyPartyExistsUsecase } from '@core/domain/usecases/verify-party-exists-usecase';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/entities/party-consent';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('GetAgreementsUsecase', () => {
  let getAgreementsUsecase: GetAgreementsUsecase;
  let mockVerifyPartyExistsUsecase: IVerifyPartyExistsUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    mockVerifyPartyExistsUsecase = mock<IVerifyPartyExistsUsecase>();
    fakeAgreementRepository = new FakeAgreementRepository();

    getAgreementsUsecase = new GetAgreementsUsecase(
      mockVerifyPartyExistsUsecase,
      fakeAgreementRepository,
    );
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

    jest.spyOn(mockVerifyPartyExistsUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await getAgreementsUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toEqual(expect.arrayContaining([fakeAgreement]));
    expect(fakeAgreementRepository.findAllByPartyIdCalledTimes).toBe(1);
  });
});
