import {
  PartyConsent,
  PartyConsentProps,
  PartyConsentStatus,
} from '@agreements/domain/value-objects/party-consent';

type MakePartyConsentProps = Partial<PartyConsentProps>;

export const makePartyConsent = (id?: string, props?: MakePartyConsentProps): PartyConsent => {
  return PartyConsent.create(
    {
      status: PartyConsentStatus.PENDING,
      ...props,
    },
    id ?? '19bddfc6-7835-4701-8f5d-5e22147036c9',
  ).value as PartyConsent;
};
