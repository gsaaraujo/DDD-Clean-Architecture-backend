import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';

describe('fake-party-repository', () => {
  let fakePartyRepository: FakePartyRepository;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
  });

  describe('exists', () => {
    it('should return true if party does exist with the given id', async () => {
      fakePartyRepository.partiesIds = [
        '0c87cf42-1369-4e9f-893d-9d0c7709b8b4',
        'ac98db8a-be3f-47c1-ba8d-a52d96c05752',
        '2fc98ddb-006c-43a6-9f1b-13d9c19a0158',
      ];

      const sut = await fakePartyRepository.exists('ac98db8a-be3f-47c1-ba8d-a52d96c05752');

      expect(sut).toBeTruthy();
    });

    it('should return false if party does not exist with the given id', async () => {
      fakePartyRepository.partiesIds = [
        '0c87cf42-1369-4e9f-893d-9d0c7709b8b4',
        'ac98db8a-be3f-47c1-ba8d-a52d96c05752',
        '2fc98ddb-006c-43a6-9f1b-13d9c19a0158',
      ];

      const sut = await fakePartyRepository.exists('501f2325-755d-4195-b680-c4cc869617a8');

      expect(sut).toBeFalsy();
    });
  });
});
