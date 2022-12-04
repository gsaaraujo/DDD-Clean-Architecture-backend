import { OwingItem } from './owing-item';
import { ItemAmountLimitError } from '../errors/item-amount-limit-error';
import { CurrencyItemAmountLimitError } from '../errors/currency-amount-limit-error';
import { CurrencyAmountMustBeInCentsError } from '../errors/currency-amount-must-be-in-cents-error';

describe('OwingItem', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create OwingItem', () => {
    const sut = OwingItem.create({ amount: 20, description: '', isCurrency: true });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(OwingItem);
  });

  it('should reconstitute OwingItem', () => {
    const sut = OwingItem.reconstitute({ amount: 20, description: '', isCurrency: true });

    expect(sut).toBeInstanceOf(OwingItem);
  });

  it("should return CurrencyAmountMustBeInCentsError if it's currency and not a integer", () => {
    const sut = OwingItem.create({ amount: 2.5, description: '', isCurrency: true });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrencyAmountMustBeInCentsError);
  });

  it("should return CurrencyItemAmountLimitError if it's currency and less than 1", () => {
    const sut = OwingItem.create({ amount: 0, description: '', isCurrency: true });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrencyItemAmountLimitError);
  });

  it("should return CurrencyItemAmountLimitError if it's currency and greater than 100000000", () => {
    const sut = OwingItem.create({ amount: 200000000, description: '', isCurrency: true });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrencyItemAmountLimitError);
  });

  it("should return ItemAmountLimitError if it's not currency and less than 1", () => {
    const sut = OwingItem.create({ amount: 0, description: '', isCurrency: false });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(ItemAmountLimitError);
  });

  it("should return ItemAmountLimitError if it's not currency and greater than 20", () => {
    const sut = OwingItem.create({ amount: 20, description: '', isCurrency: false });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(ItemAmountLimitError);
  });
});
