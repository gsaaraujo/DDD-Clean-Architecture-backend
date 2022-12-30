import {
  PartyConsent,
  PartyConsentProps,
  PartyConsentStatus,
} from '@agreements/domain/entities/party-consent';

type MakePartyConsentProps = Partial<PartyConsentProps>;

export const makePartyConsent = (props?: MakePartyConsentProps) => {
  return PartyConsent.reconstitute('d7d2be15-34d8-43b8-9593-0d2df52c85c4', {
    status: PartyConsentStatus.PENDING,
    ...props,
  });
};
