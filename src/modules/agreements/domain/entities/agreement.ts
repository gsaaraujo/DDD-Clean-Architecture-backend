import { Entity } from '../../../shared/helpers/entity';
import { Either, left, right } from '../../../shared/helpers/either';

import { OwingItem } from '../value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from './party-consent';

import { BaseError } from '../../../shared/helpers/base-error';
import { CreditorAndDebtorCannotBeTheSameError } from '../errors/creditor-and-debtor-cannot-be-the-same-error';

type AgreementProps = {
  debtorPartyId: string;
  creditorPartyId: string;

  createdAt: Date;
  owingItem: OwingItem;
  debtorPartyConsent: PartyConsent;
  creditorPartyConsent: PartyConsent;
};

type AgreementCreate = {
  debtorPartyId: string;
  creditorPartyId: string;

  owingItem: OwingItem;
};

type AgreementReconstitute = AgreementProps;

export class Agreement extends Entity<AgreementProps> {
  public static create(props: AgreementCreate): Either<BaseError, Agreement> {
    if (props.creditorPartyId === props.debtorPartyId) {
      const error = new CreditorAndDebtorCannotBeTheSameError(
        'Creditor and debtor parties cannot be the same',
      );
      return left(error);
    }

    const agreement = new Agreement({
      ...props,
      createdAt: new Date(),
      debtorPartyConsent: PartyConsent.create({ status: PartyConsentStatus.PENDING }),
      creditorPartyConsent: PartyConsent.create({ status: PartyConsentStatus.PENDING }),
    });
    return right(agreement);
  }

  public static reconstitute(id: string, props: AgreementReconstitute): Agreement {
    return new Agreement(props, id);
  }
}
