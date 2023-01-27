import admin from 'firebase-admin';
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';
import { NotifyPartyUsecase } from '@agreements/application/usecases/notify-party-usecase';
import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';
import { PayAnAgreementUsecase } from '@agreements/application/usecases/pay-an-agreement-usecase';
import { MakeAnAgreementUsecase } from '@agreements/application/usecases/make-an-agreement-usecase';
import { DenyAnAgreementUsecase } from '@agreements/application/usecases/deny-an-agreement-usecase';
import { AcceptAnAgreementUsecase } from '@agreements/application/usecases/accept-an-agreement-usecase';
import { CancelAnAgreementUsecase } from '@agreements/application/usecases/cancel-an-agreement-usecase';
import { RemoveAnAgreementUsecase } from '@agreements/application/usecases/remove-an-agreement-usecase';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';
import { INotificationService } from '@agreements/adapters/services/notification-service';
import { IAgreementRepository } from '@agreements/adapters/repositories/agreement-repository';
import { INotificationRepository } from '@agreements/adapters/repositories/notification-repository';

import { PrismaPartyRepository } from '@agreements/infra/repositories/prisma/prisma-party-repository';
import { GetAgreementsController } from '@agreements/infra/presenter/controllers/get-agreements-controller';
import { PrismaAgreementRepository } from '@agreements/infra/repositories/prisma/prisma-agreement-repository';
import { PayAnAgreementController } from '@agreements/infra/presenter/controllers/pay-an-agreement-controller';
import { FirebaseNotificationService } from '@agreements/infra/services/firebase/firebase-notification-service';
import { DenyAnAgreementController } from '@agreements/infra/presenter/controllers/deny-an-agreement-controller';
import { MakeAnAgreementController } from '@agreements/infra/presenter/controllers/make-an-agreement-controller';
import { PrismaNotificationRepository } from '@agreements/infra/repositories/prisma/prisma-notification-repository';
import { AcceptAnAgreementController } from '@agreements/infra/presenter/controllers/accept-an-agreement-controller';
import { CancelAnAgreementController } from '@agreements/infra/presenter/controllers/cancel-an-agreement-controller';
import { RemoveAnAgreementController } from '@agreements/infra/presenter/controllers/remove-an-agreement-controller';

@Module({
  controllers: [
    GetAgreementsController,
    PayAnAgreementController,
    DenyAnAgreementController,
    MakeAnAgreementController,
    AcceptAnAgreementController,
    CancelAnAgreementController,
    RemoveAnAgreementController,
  ],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
    {
      provide: admin.initializeApp,
      useValue: admin.initializeApp(),
    },
    {
      provide: PrismaAgreementRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaAgreementRepository(prismaClient),
    },
    {
      provide: PrismaNotificationRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaNotificationRepository(prismaClient),
    },
    {
      provide: PrismaPartyRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaPartyRepository(prismaClient),
    },
    {
      provide: FirebaseNotificationService,
      inject: [admin.initializeApp, PrismaPartyRepository],
      useFactory: (firebaseApp: admin.app.App, partyRepository: IPartyRepository) =>
        new FirebaseNotificationService(firebaseApp, partyRepository),
    },
    {
      provide: NotifyPartyUsecase,
      inject: [PrismaPartyRepository, PrismaNotificationRepository, FirebaseNotificationService],
      useFactory: (
        partyRepository: IPartyRepository,
        notificationRepository: INotificationRepository,
        notificationService: INotificationService,
      ) => new NotifyPartyUsecase(partyRepository, notificationRepository, notificationService),
    },
    {
      provide: 'IGetAgreementsUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (partyRepository: IPartyRepository, agreementRepository: IAgreementRepository) =>
        new GetAgreementsUsecase(partyRepository, agreementRepository),
    },
    {
      provide: 'IAcceptAnAgreementUsecase',
      inject: [NotifyPartyUsecase, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new AcceptAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'ICancelAnAgreementUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new CancelAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'IDenyAnAgreementUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new DenyAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'IPayAnAgreementUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new PayAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'IRemoveAnAgreementUsecase',
      inject: [PrismaAgreementRepository],
      useFactory: (agreementRepository: IAgreementRepository) =>
        new RemoveAnAgreementUsecase(agreementRepository),
    },
    {
      provide: 'IMakeAnAgreementUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        partyRepository: IPartyRepository,
        agreementRepository: IAgreementRepository,
      ) => new MakeAnAgreementUsecase(notifyPartyUsecase, partyRepository, agreementRepository),
    },
  ],
})
export class AgreementsModule {}
