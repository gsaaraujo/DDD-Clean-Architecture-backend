import { OwingItem, OwingItemProps } from '@agreements/domain/value-objects/owing-item';

type MakeOwingItem = Partial<OwingItemProps>;

export const makeOwingItem = (props?: MakeOwingItem) => {
  return OwingItem.create({ amount: 20, isCurrency: true, ...props });
};
