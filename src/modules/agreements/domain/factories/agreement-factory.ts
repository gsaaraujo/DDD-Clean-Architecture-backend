import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { Agreement, AgreementProps } from '@agreements/domain/entities/agreement';

type MakeAgreementProps = Partial<
  Omit<AgreementProps, 'createdAt' | 'debtorPartyConsent' | 'creditorPartyConsent'>
>;

export const makeAgreement = (props?: MakeAgreementProps): Agreement => {
  return Agreement.create({
    debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
    creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
    owingItem: OwingItem.create({
      amount: 2,
      isCurrency: false,
    }).value as OwingItem,
    ...props,
  }).value as Agreement;
};
