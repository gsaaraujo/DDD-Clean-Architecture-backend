import { PartyNotFoundError } from '@core/application/errors/party-not-found-error';
import { VerifyPartyExistsUsecase } from '@core/application/usecases/verify-party-exists-usecase';

import { FakePartyRepository } from '@core/infra/fake/fake-party-repository';

describe('verify-party-exists', () => {
  let verifyPartyExistsUsecase: VerifyPartyExistsUsecase;
  let fakePartyRepository: FakePartyRepository;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    verifyPartyExistsUsecase = new VerifyPartyExistsUsecase(fakePartyRepository);
  });

  it('should return void if user was found', async () => {
    fakePartyRepository.partiesIds = [
      '7996df68-b1d7-4af3-99c4-b86bd16b8cc7',
      'afe7ff90-2306-46e6-b11b-7ea0b2f1e434',
      'e1e0ff7b-631a-4858-8213-88ae70b4e81e',
    ];

    const sut = await verifyPartyExistsUsecase.execute({
      partyId: 'afe7ff90-2306-46e6-b11b-7ea0b2f1e434',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
  });

  it('should return PartyNotFoundError if user was not found', async () => {
    fakePartyRepository.partiesIds = [
      '7996df68-b1d7-4af3-99c4-b86bd16b8cc7',
      'afe7ff90-2306-46e6-b11b-7ea0b2f1e434',
      'e1e0ff7b-631a-4858-8213-88ae70b4e81e',
    ];

    const sut = await verifyPartyExistsUsecase.execute({
      partyId: 'bc6c6adf-8104-4f70-950d-6fdacfe3f6a7',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });
});
