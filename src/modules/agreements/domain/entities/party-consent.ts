import { Entity } from '../../../shared/helpers/entity';
import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors/domain-error';

import { CurrentStatusMustBePendingError } from '../errors/current-status-must-be-pending-error';
import { CurrentStatusMustBeAcceptedError } from '../errors/current-status-must-be-accepted-error';

export enum PartyConsentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
}

type PartyConsentProps = {
  status: PartyConsentStatus;
};

export class PartyConsent extends Entity<PartyConsentProps> {
  public static create(props: PartyConsentProps): PartyConsent {
    const partyConsent = new PartyConsent(props);
    return partyConsent;
  }

  public static reconstitute(id: string, props: PartyConsentProps): PartyConsent {
    return new PartyConsent(props, id);
  }

  public acceptAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.PENDING) {
      const error = new CurrentStatusMustBePendingError(
        "To accept the agreement it must be in 'pending' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.ACCEPTED;
    return right(undefined);
  }

  public denyAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.PENDING) {
      const error = new CurrentStatusMustBePendingError(
        "To deny the agreement it must be in 'pending' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.DENIED;
    return right(undefined);
  }

  public cancelAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.ACCEPTED) {
      const error = new CurrentStatusMustBeAcceptedError(
        "To cancel the agreement it must be in 'accepted' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.CANCELED;
    return right(undefined);
  }

  public payAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.ACCEPTED) {
      const error = new CurrentStatusMustBeAcceptedError(
        "To cancel the agreement it must be in 'accepted' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.PAID;
    return right(undefined);
  }

  public get status(): PartyConsentStatus {
    return this.props.status;
  }
}
