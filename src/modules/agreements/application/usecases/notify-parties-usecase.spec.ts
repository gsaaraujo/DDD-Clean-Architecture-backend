import { mock } from 'jest-mock-extended';

import { right } from '../../../shared/helpers/either';
import { IVerifyPartyExistsUsecase } from '../../../shared/domain/usecases/verify-party-exists-usecase';

import { NotifyPartiesUsecase } from './notify-parties-usecase';

import { FakeNotificationRepository } from '../../infra/repositories/fake/fake-notification-repository';

import { FakeNotificationService } from '../../infra/services/fake/fake-notification-service';

describe('notify-parties-usecase', () => {
  let notifyPartiesUsecase: NotifyPartiesUsecase;

  let mockVerifyPartyExistsUsecase: IVerifyPartyExistsUsecase;
  let fakeNotificationRepository: FakeNotificationRepository;
  let fakeNotificationService: FakeNotificationService;

  beforeEach(() => {
    mockVerifyPartyExistsUsecase = mock<IVerifyPartyExistsUsecase>();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeNotificationService = new FakeNotificationService();

    notifyPartiesUsecase = new NotifyPartiesUsecase(
      mockVerifyPartyExistsUsecase,
      fakeNotificationRepository,
      fakeNotificationService,
    );
  });

  it('should notify parties', async () => {
    jest
      .spyOn(mockVerifyPartyExistsUsecase, 'execute')
      .mockResolvedValueOnce(right(undefined))
      .mockResolvedValueOnce(right(undefined));

    const sut = await notifyPartiesUsecase.execute({
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'any_creditor_party_id',
      title: 'any_title',
      content: 'any_content',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledTimes(2);
    expect(fakeNotificationService.sendCalledTimes).toBe(2);
    expect(fakeNotificationRepository.createCalledTimes).toBe(2);

    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledWith({
      partyId: 'any_debtor_party_id',
    });
    expect(mockVerifyPartyExistsUsecase.execute).toHaveBeenCalledWith({
      partyId: 'any_creditor_party_id',
    });
  });
});
