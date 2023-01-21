import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';

import { GetAgreementsController } from '@agreements/infra/controllers/get-agreements-controller';
import { PrismaPartyRepository } from '@agreements/infra/repositories/prisma/prisma-party-repository';
import { PrismaAgreementRepository } from '@agreements/infra/repositories/prisma/prisma-agreement-repository';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';
import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';

@Module({
  controllers: [GetAgreementsController],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
    {
      provide: PrismaPartyRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaPartyRepository(prismaClient),
    },
    {
      provide: PrismaAgreementRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaAgreementRepository(prismaClient),
    },
    {
      provide: 'IGetAgreementsUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (partyRepository: IPartyRepository, agreementRepository: IAgreementRepository) =>
        new GetAgreementsUsecase(partyRepository, agreementRepository),
    },
  ],
})
export class AgreementsModule {}
