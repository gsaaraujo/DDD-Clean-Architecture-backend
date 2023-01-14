import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { makeParty } from '@test/factories/party-factory';

describe('fake-party-repository', () => {
  let fakePartyRepository: FakePartyRepository;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
  });

  describe('exists', () => {
    it('should return true if party does exist with the given id', async () => {
      const party = makeParty();
      fakePartyRepository.parties.push(party);

      const sut = await fakePartyRepository.exists(party.id);

      expect(sut).toBeTruthy();
    });

    it('should return false if party does not exist with the given id', async () => {
      const party = makeParty();
      fakePartyRepository.parties.push(party);

      const sut = await fakePartyRepository.exists('501f2325-755d-4195-b680-c4cc869617a8');

      expect(sut).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should persist and return the party', async () => {
      const party = makeParty();

      const sut = await fakePartyRepository.create(party);

      expect(sut).toStrictEqual(party);
      expect(fakePartyRepository.parties.length).toBe(1);
    });
  });

  describe('findOneRegistrationTokenByPartyId', () => {
    it('should find and return the registration token with the given partyId', async () => {
      const party = makeParty();
      fakePartyRepository.parties.push(party);

      const sut = await fakePartyRepository.findOneRegistrationTokenByPartyId(party.id);

      expect(sut).toBe(party.registrationToken);
    });

    it('should return null if no registration token was found with the given partyId', async () => {
      const sut = await fakePartyRepository.findOneRegistrationTokenByPartyId(
        '34544687-2074-4c57-9ac6-b87946f0df45',
      );

      expect(sut).toBeNull();
    });
  });
});
