import { MakeAnAgreementUsecase } from './make-an-agreement-usecase';

import { Agreement } from '../../domain/entities/agreement';
import { MakeAnAgreementUsecaseInput } from '../../domain/usecases/make-an-agreement-usecase';

import { FakePartyRepository } from '../../infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '../../infra/repositories/fake/fake-agreement-repository';

import { DebtorPartyNotFoundError } from '../errors/debtor-party-not-found-error';
import { CreditorPartyNotFoundError } from '../errors/creditor-party-not-found-error';
import { FakeNotificationService } from '../../infra/services/fake/fake-notification-service';

describe('MakeAnAgreementUsecase', () => {
  let makeAnAgreementUsecase: MakeAnAgreementUsecase;
  let fakePartyRepository: FakePartyRepository;
  let fakeAgreementRepository: FakeAgreementRepository;
  let fakeNotificationService: FakeNotificationService;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    fakeAgreementRepository = new FakeAgreementRepository();
    fakeNotificationService = new FakeNotificationService();

    makeAnAgreementUsecase = new MakeAnAgreementUsecase(
      fakePartyRepository,
      fakeAgreementRepository,
      fakeNotificationService,
    );
  });

  it('should make an agreement and notify parties', async () => {
    const input: MakeAnAgreementUsecaseInput = {
      amount: 2,
      isCurrency: false,
      description: 'any description',
      debtorPartyId: '9c491d19-cbb6-483c-904b-af83bb0a4bbd',
      creditorPartyId: '4aa56fca-4d0f-4eb8-9918-a53ffac0c443',
    };

    fakePartyRepository.parties.push(
      { id: '9c491d19-cbb6-483c-904b-af83bb0a4bbd' },
      { id: '4aa56fca-4d0f-4eb8-9918-a53ffac0c443' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await makeAnAgreementUsecase.execute(input);

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Agreement);

    expect(fakePartyRepository.existsCalledTimes).toBe(2);
    expect(fakeAgreementRepository.agreements.length).toBe(1);
    expect(fakeAgreementRepository.createCalledTimes).toBe(1);
    expect(fakeNotificationService.notifyPartiesCalledTimes).toBe(1);
  });

  it('should return CreditorPartyNotFoundError if creditor was not found', async () => {
    const fakeInput: MakeAnAgreementUsecaseInput = {
      amount: 2,
      isCurrency: false,
      description: 'any description',
      debtorPartyId: '9c491d19-cbb6-483c-904b-af83bb0a4bbd',
      creditorPartyId: '4aa56fca-4d0f-4eb8-9918-a53ffac0c443',
    };

    fakePartyRepository.parties.push(
      { id: '9c491d19-cbb6-483c-904b-af83bb0a4bbd' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await makeAnAgreementUsecase.execute(fakeInput);

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CreditorPartyNotFoundError);
  });

  it('should return DebtorPartyNotFoundError if debtor was not found', async () => {
    const fakeInput: MakeAnAgreementUsecaseInput = {
      amount: 2,
      isCurrency: false,
      description: 'any description',
      debtorPartyId: '9c491d19-cbb6-483c-904b-af83bb0a4bbd',
      creditorPartyId: '4aa56fca-4d0f-4eb8-9918-a53ffac0c443',
    };

    fakePartyRepository.parties.push(
      { id: '4aa56fca-4d0f-4eb8-9918-a53ffac0c443' },
      { id: '5bbeec93-1049-4209-88ef-195f5acb28bc' },
      { id: '13d3215f-ec71-42cc-83b1-f051d030e43a' },
    );

    const sut = await makeAnAgreementUsecase.execute(fakeInput);

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DebtorPartyNotFoundError);
  });
});
