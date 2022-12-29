import { NotifyPartiesUsecase } from '@agreements/application/usecases/notify-parties-usecase';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeNotificationService } from '@agreements/infra/services/fake/fake-notification-service';
import { FakeNotificationRepository } from '@agreements/infra/repositories/fake/fake-notification-repository';

describe('notify-parties-usecase', () => {
  let notifyPartiesUsecase: NotifyPartiesUsecase;

  let fakePartyRepository: FakePartyRepository;
  let fakeNotificationRepository: FakeNotificationRepository;
  let fakeNotificationService: FakeNotificationService;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeNotificationService = new FakeNotificationService();

    notifyPartiesUsecase = new NotifyPartiesUsecase(
      fakePartyRepository,
      fakeNotificationRepository,
      fakeNotificationService,
    );
  });

  it('should notify the parties', async () => {
    fakePartyRepository.partiesIds = [
      '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      '7e25135b-7ee3-447a-a722-aa81e0285b26',
      'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    ];

    const sut = await notifyPartiesUsecase.execute({
      partyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
      title: 'any_title',
      content: 'any_content',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
  });
});
