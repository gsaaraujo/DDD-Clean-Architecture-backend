import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AgreementsModule } from '@agreements/main/agreements-module';

describe('accept-an-agreement', () => {
  let nestApplication: INestApplication;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AgreementsModule],
    }).compile();

    nestApplication = testingModule.createNestApplication();
    await nestApplication.init();
  });

  afterAll(async () => {
    await nestApplication.close();
  });

  it('should accept an agreement', async () => {
    const result = await request(nestApplication.getHttpServer()).patch(
      '/accept-an-agreement/:partyId/:agreementId',
    );

    expect(result.statusCode).toBe(200);
  });
});
