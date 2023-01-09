import { Agreement as AgreementORM } from '@prisma/client';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';

export class PrismaAgreementMapper {
  public static toDomain(agreementORM: AgreementORM): Agreement {
    return Agreement.create(
      {
        debtorPartyId: agreementORM.debtorPartyId,
        creditorPartyId: agreementORM.creditorPartyId,
        createdAt: agreementORM.madeAt,
        owingItem: OwingItem.create({
          amount: agreementORM.amount,
          isCurrency: agreementORM.isCurrency,
        }).value as OwingItem,
        debtorPartyConsent: PartyConsent.create({
          status: this.partyStatusToDomain(agreementORM.debtorStatus),
        }).value as PartyConsent,
        creditorPartyConsent: PartyConsent.create({
          status: this.partyStatusToDomain(agreementORM.creditorStatus),
        }).value as PartyConsent,
      },
      agreementORM.id,
    ).value as Agreement;
  }

  public static toPersistence(agreement: Agreement): AgreementORM {
    return {
      id: agreement.id,
      debtorPartyId: agreement.debtorPartyId,
      creditorPartyId: agreement.creditorPartyId,
      madeAt: agreement.createdAt,
      amount: agreement.owingItem.amount,
      isCurrency: agreement.owingItem.isCurrency,
      description: agreement.owingItem.description,
      debtorStatus: agreement.debtorPartyConsent.status,
      creditorStatus: agreement.creditorPartyConsent.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private static partyStatusToDomain(raw: any): PartyConsentStatus {
    switch (raw) {
      case 'ACCEPTED':
        return PartyConsentStatus.ACCEPTED;

      case 'CANCELED':
        return PartyConsentStatus.CANCELED;

      case 'DENIED':
        return PartyConsentStatus.DENIED;

      case 'PAID':
        return PartyConsentStatus.PAID;

      case 'PENDING':
        return PartyConsentStatus.PENDING;

      default:
        return PartyConsentStatus.PENDING;
    }
  }
}
