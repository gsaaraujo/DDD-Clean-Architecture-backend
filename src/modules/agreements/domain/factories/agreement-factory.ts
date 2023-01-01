import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { Agreement, AgreementProps } from '@agreements/domain/entities/agreement';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';

type MakeAgreementProps = Partial<AgreementProps>;

export const makeAgreement = (props?: MakeAgreementProps) => {
  return Agreement.reconstitute('9f3a766c-eb64-4b6b-91a1-36b4b501476e', {
    debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
    creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
    createdAt: new Date('2022-12-12'),
    owingItem: OwingItem.reconstitute({
      amount: 2,
      isCurrency: false,
    }),
    creditorPartyConsent: PartyConsent.reconstitute({
      status: PartyConsentStatus.PENDING,
    }),
    debtorPartyConsent: PartyConsent.reconstitute({
      status: PartyConsentStatus.PENDING,
    }),
    ...props,
  });
};
