import { OwingItem, OwingItemProps } from '@agreements/domain/value-objects/owing-item';

type MakeOwingItem = Partial<OwingItemProps>;

export const makeOwingItem = (id?: string, props?: MakeOwingItem): OwingItem => {
  return OwingItem.create(
    { amount: 20, isCurrency: true, ...props },
    id ?? 'a47db200-2a13-4b88-a155-c8d7aca1c26c',
  ).value as OwingItem;
};
