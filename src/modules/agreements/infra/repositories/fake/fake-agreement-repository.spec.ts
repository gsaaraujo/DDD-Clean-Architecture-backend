import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/entities/party-consent';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('fake-agreement-repository', () => {
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakeAgreementRepository = new FakeAgreementRepository();
  });

  describe('exists', () => {
    it('should return true if the agreement exists with given the agreementId', async () => {
      const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
        debtorPartyId: 'any_debtor_party_id',
        creditorPartyId: 'any_creditor_party_id',
        createdAt: new Date(),
        owingItem: OwingItem.reconstitute({
          amount: 2,
          isCurrency: false,
          description: 'any_description',
        }),
        debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
        creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
      });

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.exists('a6f75ab2-989f-4e51-87ac-d3c5da03ce48');

      expect(sut).toBeTruthy();
    });

    it('should return false if the agreement does not exist with the given agreementId', async () => {
      const sut = await fakeAgreementRepository.exists('a6f75ab2-989f-4e51-87ac-d3c5da03ce48');

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

  describe('findById', () => {
    it('should find and return an agreement with the given agreementId', async () => {
      const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
        debtorPartyId: 'any_debtor_party_id',
        creditorPartyId: 'any_creditor_party_id',
        createdAt: new Date(),
        owingItem: OwingItem.reconstitute({
          amount: 2,
          isCurrency: false,
          description: 'any_description',
        }),
        debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
        creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
      });

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findById('a6f75ab2-989f-4e51-87ac-d3c5da03ce48');

      expect(sut).toStrictEqual(fakeAgreement);
    });

    it('should return null if no agreement was found with the given id', async () => {
      const sut = await fakeAgreementRepository.findById('a6f75ab2-989f-4e51-87ac-d3c5da03ce48');

      expect(sut).toBeNull();
    });
  });

  describe('findByIdAndPartyId', () => {
    it('should find and return an agreement with the given agreementId and partyId', async () => {
      const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
        debtorPartyId: '9822368d-59ed-4527-a588-1a2de04b16e3',
        creditorPartyId: 'any_creditor_party_id',
        createdAt: new Date(),
        owingItem: OwingItem.reconstitute({
          amount: 2,
          isCurrency: false,
          description: 'any_description',
        }),
        debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
        creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
      });

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findByIdAndPartyId(
        'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
        '9822368d-59ed-4527-a588-1a2de04b16e3',
      );

      expect(sut).toStrictEqual(fakeAgreement);
    });

    it('should return null if no agreement was found with the given agreementId and partyId', async () => {
      const sut = await fakeAgreementRepository.findByIdAndPartyId(
        'a6f75ab2-989f-4e51-87ac-d3c5da03ce48',
        '9822368d-59ed-4527-a588-1a2de04b16e3',
      );

      expect(sut).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated agreement with the given updated agreement', async () => {
      const fakeAgreement = Agreement.reconstitute('any_agreement_id', {
        debtorPartyId: 'any_debtor_party_id',
        creditorPartyId: 'any_creditor_party_id',
        createdAt: new Date(),
        owingItem: OwingItem.reconstitute({
          amount: 2,
          isCurrency: false,
          description: 'any_description',
        }),
        debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
        creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
      });

      const fakeUpdatedAgreement = Agreement.reconstitute('any_agreement_id', {
        debtorPartyId: 'any_debtor_party_id_updated',
        creditorPartyId: 'any_creditor_party_id_updated',
        createdAt: new Date(),
        owingItem: OwingItem.reconstitute({
          amount: 2,
          isCurrency: false,
          description: 'any_description_updated',
        }),
        debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent_updated', {
          status: PartyConsentStatus.PENDING,
        }),
        creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent_updated', {
          status: PartyConsentStatus.PENDING,
        }),
      });

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.update(fakeUpdatedAgreement);

      expect(sut).toStrictEqual(fakeUpdatedAgreement);
      expect(fakeAgreementRepository.agreements.length).toBe(1);
      expect(fakeAgreement.isEquals(fakeAgreementRepository.agreements[0])).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should delete and return true if the agreement was deleted with the given agreementId', async () => {
      const fakeAgreement = Agreement.reconstitute('a6f75ab2-989f-4e51-87ac-d3c5da03ce48', {
        debtorPartyId: '9822368d-59ed-4527-a588-1a2de04b16e3',
        creditorPartyId: 'any_creditor_party_id',
        createdAt: new Date(),
        owingItem: OwingItem.reconstitute({
          amount: 2,
          isCurrency: false,
          description: 'any_description',
        }),
        debtorPartyConsent: PartyConsent.reconstitute('any_debtor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
        creditorPartyConsent: PartyConsent.reconstitute('any_creditor_party_consent', {
          status: PartyConsentStatus.PENDING,
        }),
      });

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.delete('a6f75ab2-989f-4e51-87ac-d3c5da03ce48');

      expect(sut).toBeTruthy();
      expect(fakeAgreementRepository.agreements.length).toBe(0);
    });
  });
});
