import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { makeAgreement } from '@agreements/domain/factories/agreement-factory';
import { PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import { makePartyConsent } from '@agreements/domain/factories/party-consent-factory';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('fake-agreement-repository', () => {
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakeAgreementRepository = new FakeAgreementRepository();
  });

  describe('exists', () => {
    it('should return true if the agreement exists with given the agreementId', async () => {
      const fakeAgreement = makeAgreement();

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.exists('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toBeTruthy();
    });

    it('should return false if the agreement does not exist with the given agreementId', async () => {
      const sut = await fakeAgreementRepository.exists('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should persist and return the agreement', async () => {
      const fakeAgreement = Agreement.create({
        debtorPartyId: 'any_debtor_party_id',
        creditorPartyId: 'any_creditor_party_id',
        owingItem: OwingItem.create({
          amount: 2,
          isCurrency: false,
          description: 'any_description',
        }).value as OwingItem,
      }).value as Agreement;

      const sut = await fakeAgreementRepository.create(fakeAgreement);

      expect(sut).toStrictEqual(fakeAgreement);
      expect(fakeAgreementRepository.agreements.length).toBe(1);
    });
  });

  describe('findOneById', () => {
    it('should find and return an agreement with the given agreementId', async () => {
      const fakeAgreement = makeAgreement();

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findOneById('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toStrictEqual(fakeAgreement);
    });

    it('should return null if no agreement was found with the given id', async () => {
      const sut = await fakeAgreementRepository.findOneById('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toBeNull();
    });
  });

  describe('findOneByIdAndPartyId', () => {
    it('should find and return an agreement with the given agreementId and partyId', async () => {
      const fakeAgreement = makeAgreement();

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findOneByIdAndPartyId(
        '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
        '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      );

      expect(sut).toStrictEqual(fakeAgreement);
    });

    it('should return null if no agreement was found with the given agreementId and partyId', async () => {
      const sut = await fakeAgreementRepository.findOneByIdAndPartyId(
        '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
        '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      );

      expect(sut).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated agreement with the given updated agreement', async () => {
      const fakeAgreement = makeAgreement();

      const fakeUpdatedAgreement = makeAgreement({
        creditorPartyConsent: makePartyConsent({ status: PartyConsentStatus.PAID }),
      });

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.update(fakeUpdatedAgreement);

      expect(sut).toStrictEqual(fakeUpdatedAgreement);
      expect(fakeAgreementRepository.agreements.length).toBe(1);
      expect(fakeAgreementRepository.agreements[0]).toStrictEqual(fakeUpdatedAgreement);
    });
  });

  describe('delete', () => {
    it('should delete and return true if the agreement was deleted with the given agreementId', async () => {
      const fakeAgreement = makeAgreement();

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.delete('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toBeTruthy();
      expect(fakeAgreementRepository.agreements.length).toBe(0);
    });
  });
});
