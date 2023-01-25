import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';

import { GetAgreementsController } from '@agreements/infra/presenter/controllers/get-agreements-controller';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';
import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';
import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

@Module({
  controllers: [GetAgreementsController],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
    {
      provide: FakePartyRepository,
      useFactory: () => new FakePartyRepository(),
    },
    {
      provide: FakeAgreementRepository,
      useFactory: () => new FakeAgreementRepository(),
    },
    {
      provide: 'IGetAgreementsUsecase',
      inject: [FakePartyRepository, FakeAgreementRepository],
      useFactory: (partyRepository: IPartyRepository, agreementRepository: IAgreementRepository) =>
        new GetAgreementsUsecase(partyRepository, agreementRepository),
    },
  ],
})
export class AgreementsModule {}
