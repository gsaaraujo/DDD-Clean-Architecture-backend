import { BaseError } from '../../../shared/helpers/base-error';
import { ValueObject } from '../../../shared/helpers/value-object';
import { Either, left, right } from '../../../shared/helpers/either';

import { ItemAmountLimitError } from '../errors/item-amount-limit-error';
import { CurrencyItemAmountLimitError } from '../errors/currency-amount-limit-error';
import { CurrencyAmountMustBeInCentsError } from '../errors/currency-amount-must-be-in-cents-error';

type OwingItemProps = {
  amount: number;
  isCurrency: boolean;
  description?: string;
};

type OwingItemCreate = OwingItemProps;

type OwingItemReconstitute = OwingItemProps;

export class OwingItem extends ValueObject<OwingItemProps> {
  public static create(props: OwingItemCreate): Either<BaseError, OwingItem> {
    if (props.isCurrency && !Number.isInteger(props.amount)) {
      const error = new CurrencyAmountMustBeInCentsError('Currency amount must be in cents');
      return left(error);
    }

    if (props.isCurrency && (props.amount < 1 || props.amount > 100000000)) {
      const error = new CurrencyItemAmountLimitError(
        'Currency amount limit must be between 1 to 100000000 cents',
      );
      return left(error);
    }

    if (!props.isCurrency && (props.amount < 1 || props.amount > 10)) {
      const error = new ItemAmountLimitError('Item amount limit must be between 0 to 10');
      return left(error);
    }

    const owingItem = new OwingItem(props);
    return right(owingItem);
  }

  public static reconstitute(props: OwingItemReconstitute): OwingItem {
    const owingItem = new OwingItem(props);
    return owingItem;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get isCurrency(): boolean {
    return this.props.isCurrency;
  }

  public get description(): string {
    return this.props.description ?? 'No description';
  }
}