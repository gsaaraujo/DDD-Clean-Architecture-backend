import { Profile as ProfileORM } from '@prisma/client';

type MakeProfileORMProps = Partial<ProfileORM>;

export const makeProfileORM = (props?: MakeProfileORMProps): ProfileORM => {
  return {
    id: 'e4e6cc4c-3227-424b-a130-42eb9dd1855b',
    userId: 'ca433baf-a316-4634-95a5-8978555bd895',
    imageUrl: null,
    name: 'Edward Elric',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...props,
  };
};
