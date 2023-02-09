import { PrismaClient } from '@prisma/client';

import { Context, createMockContext, MockContext } from '@core/tests/prisma/context';

import { makeAgreementORM } from '@agreements/tests/factories/agreement-orm-factory';
import { makeAgreementProfileORM } from '@agreements/tests/factories/agreement-profile-orm-factory';

import { Agreement } from '@agreements/domain/entities/agreement';

import { PrismaAgreementRepository } from '@agreements/infra/repositories/prisma/prisma-agreement-repository';

describe('prisma-agreement-repository', () => {
  let prismaAgreementRepository: PrismaAgreementRepository;

  let context: Context;
  let mockContext: MockContext;
  let mockPrismaClient: PrismaClient;

  beforeEach(() => {
    mockContext = createMockContext();
    context = mockContext as unknown as Context;
    mockPrismaClient = context.prisma;

    prismaAgreementRepository = new PrismaAgreementRepository(mockPrismaClient);
  });

  describe('exists', () => {
    it('', async () => {
      const agreementORM = makeAgreementORM();
      const agreementProfileORM = makeAgreementProfileORM();

      jest
        .spyOn(mockPrismaClient, '$transaction')
        .mockResolvedValueOnce([agreementORM, agreementProfileORM]);

      const sut = await prismaAgreementRepository.exists('any_agreement_id');

      expect(sut).toBeInstanceOf(Agreement);
    });
  });
});
