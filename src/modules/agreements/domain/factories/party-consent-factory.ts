import {
  PartyConsent,
  PartyConsentProps,
  PartyConsentStatus,
} from '@agreements/domain/value-objects/party-consent';

type MakePartyConsentProps = Partial<PartyConsentProps>;

export const makePartyConsent = (props?: MakePartyConsentProps) => {
  return PartyConsent.reconstitute({
    status: PartyConsentStatus.PENDING,
    ...props,
  });
};
