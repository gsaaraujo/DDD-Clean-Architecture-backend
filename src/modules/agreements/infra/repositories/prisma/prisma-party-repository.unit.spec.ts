import { PrismaClient } from '@prisma/client';

import { MockContext, Context, createMockContext } from '@core/tests/prisma/context';

import { makeUserORM } from '@agreements/tests/factories/user-orm-factory';

import { PrismaPartyRepository } from '@agreements/infra/repositories/prisma/prisma-party-repository';
import { makeUserDeviceTokenORM } from '@agreements/tests/factories/user-device-token-orm-factory';

describe('prisma-party-repository', () => {
  let prismaPartyRepository: PrismaPartyRepository;

  let context: Context;
  let mockContext: MockContext;
  let mockPrismaClient: PrismaClient;

  beforeEach(() => {
    mockContext = createMockContext();
    context = mockContext as unknown as Context;
    mockPrismaClient = context.prisma;

    prismaPartyRepository = new PrismaPartyRepository(mockPrismaClient);
  });

  describe('exists', () => {
    it('should return true if the party exists with the given id', async () => {
      const userORM = makeUserORM();

      jest.spyOn(mockPrismaClient.user, 'findUnique').mockResolvedValueOnce(userORM);

      const sut = await prismaPartyRepository.exists('any_user_id');

      expect(sut).toBeTruthy();
      expect(mockPrismaClient.user.findUnique).toBeCalledWith({
        where: { id: 'any_user_id' },
      });
    });

    it('should return false if the party does not exist with the given id', async () => {
      jest.spyOn(mockPrismaClient.user, 'findUnique').mockResolvedValueOnce(null);

      const sut = await prismaPartyRepository.exists('any_user_id');

      expect(sut).toBeFalsy();
      expect(mockPrismaClient.user.findUnique).toBeCalledWith({
        where: { id: 'any_user_id' },
      });
    });
  });

  describe('findOneRegistrationTokenByPartyId', () => {
    it('should return a registration token with the given id', async () => {
      const userDeviceTokenORM = makeUserDeviceTokenORM();

      jest
        .spyOn(mockPrismaClient.userDeviceToken, 'findUnique')
        .mockResolvedValueOnce(userDeviceTokenORM);

      const sut = await prismaPartyRepository.findOneRegistrationTokenByPartyId('any_user_id');

      expect(sut).toBe(userDeviceTokenORM.token);
      expect(mockPrismaClient.userDeviceToken.findUnique).toBeCalledWith({
        where: { id: 'any_user_id' },
      });
    });

    it('should return null if no token was found with the given id', async () => {
      jest.spyOn(mockPrismaClient.userDeviceToken, 'findUnique').mockResolvedValueOnce(null);

      const sut = await prismaPartyRepository.findOneRegistrationTokenByPartyId('any_user_id');

      expect(sut).toBeNull();
      expect(mockPrismaClient.userDeviceToken.findUnique).toBeCalledWith({
        where: { id: 'any_user_id' },
      });
    });
  });
});
