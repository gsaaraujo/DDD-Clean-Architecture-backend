import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { makeOwingItem } from './owing-item-factory';

describe('owing-item-factory', () => {
  it('should create a owing item with default values', () => {
    const fakeOwingItem = OwingItem.create({ amount: 20, isCurrency: true });

    const sut = makeOwingItem();

    expect(sut).toStrictEqual(fakeOwingItem);
  });

  it('should create a owing item with override amount value', () => {
    const fakeOwingItem = OwingItem.create({ amount: 5, isCurrency: true });

    const sut = makeOwingItem({ amount: 5 });

    expect(sut).toStrictEqual(fakeOwingItem);
  });
});
