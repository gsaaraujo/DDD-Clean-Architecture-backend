import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { makeUserORM } from '../factories/user-orm-factory';
import { makeProfileORM } from '../factories/profile-orm-factory';
import { AgreementsModule } from '@agreements/main/agreements-module';
import { makeAgreementORM } from '../factories/agreement-orm-factory';

describe('accept-an-agreement', () => {
  const prismaClient = new PrismaClient();
  let nestApplication: INestApplication;

  beforeAll(async () => {
    const debtorUserORM = makeUserORM({
      id: '9399bb27-9a23-4e1e-9665-e20022bc65cc',
      email: 'edward.elric@gmail.com',
    });

    const creditorUserORM = makeUserORM({
      id: 'd38122b8-9fe7-4900-b860-9d829c69573e',
      email: 'alphonse.elric@gmail.com',
    });

    const debtorProfileORM = makeProfileORM({
      id: '7c54ab0c-6b22-4ba0-bb58-b8b23178ad97',
      userId: debtorUserORM.id,
    });

    const creditorProfileORM = makeProfileORM({
      id: 'e3248c4c-dd0c-4f20-98b4-68bd1ec8b799',
      userId: creditorUserORM.id,
    });

    const agreementORM = makeAgreementORM({ id: '1170ed3f-3dd0-49ec-8249-fe042627233a' });

    await prismaClient.user.createMany({
      data: [debtorUserORM, creditorUserORM],
    });

    await prismaClient.profile.createMany({
      data: [debtorProfileORM, creditorProfileORM],
    });

    await prismaClient.agreement.createMany({
      data: [agreementORM],
    });
  });

  afterAll(async () => {
    const deleteAgreement = prismaClient.agreement.deleteMany();
    const deleteProfile = prismaClient.profile.deleteMany();
    const deleteUser = prismaClient.user.deleteMany();
    await prismaClient.$transaction([deleteUser, deleteProfile, deleteAgreement]);
    await prismaClient.$disconnect();
    // await nestApplication.close();
  });

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AgreementsModule],
    }).compile();

    nestApplication = testingModule.createNestApplication();
    await nestApplication.init();
  });

  it('should accept an agreement', async () => {
    const partyId = 'd38122b8-9fe7-4900-b860-9d829c69573e';
    const agreementId = '1170ed3f-3dd0-49ec-8249-fe042627233a';

    const result = await request(nestApplication.getHttpServer()).patch(
      `/accept-an-agreement/${partyId}/${agreementId}`,
    );

    expect(result.statusCode).toBe(200);
  });
});
