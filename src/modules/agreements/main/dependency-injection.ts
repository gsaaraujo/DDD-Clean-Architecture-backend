import { PrismaClient } from '@prisma/client';
import { initializeApp } from 'firebase-admin';

import { NotifyPartyUsecase } from '@agreements/application/usecases/notify-party-usecase';
import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';
import { PayAnAgreementUsecase } from '@agreements/application/usecases/pay-an-agreement-usecase';
import { MakeAnAgreementUsecase } from '@agreements/application/usecases/make-an-agreement-usecase';
import { DenyAnAgreementUsecase } from '@agreements/application/usecases/deny-an-agreement-usecase';
import { RemoveAnAgreementUsecase } from '@agreements/application/usecases/remove-an-agreement-usecase';
import { AcceptAnAgreementUsecase } from '@agreements/application/usecases/accept-an-agreement-usecase';
import { CancelAnAgreementUsecase } from '@agreements/application/usecases/cancel-an-agreement-usecase';

import { GetAgreementsController } from '@agreements/infra/controllers/get-agreements-controller';
import { PayAnAgreementController } from '@agreements/infra/controllers/pay-an-agreement-controller';
import { PrismaPartyRepository } from '@agreements/infra/repositories/prisma/prisma-party-repository';
import { MakeAnAgreementController } from '@agreements/infra/controllers/make-an-agreement-controller';
import { DenyAnAgreementController } from '@agreements/infra/controllers/deny-an-agreement-controller';
import { AcceptAnAgreementController } from '@agreements/infra/controllers/accept-an-agreement-controller';
import { RemoveAnAgreementController } from '@agreements/infra/controllers/remove-an-agreement-controller';
import { CancelAnAgreementController } from '@agreements/infra/controllers/cancel-an-agreement-controller';
import { PrismaAgreementRepository } from '@agreements/infra/repositories/prisma/prisma-agreement-repository';
import { FirebaseNotificationService } from '@agreements/infra/services/firebase/firebase-notification-service';
import { PrismaNotificationRepository } from '@agreements/infra/repositories/prisma/prisma-notification-repository';

const prismaClient = new PrismaClient();

const prismaPartyRepository = new PrismaPartyRepository(prismaClient);
const prismaAgreementRepository = new PrismaAgreementRepository(prismaClient);
const prismaNotificationRepository = new PrismaNotificationRepository(prismaClient);

const firebaseNotificationService = new FirebaseNotificationService(
  initializeApp(),
  prismaPartyRepository,
);

const notifyPartyUsecase = new NotifyPartyUsecase(
  prismaPartyRepository,
  prismaNotificationRepository,
  firebaseNotificationService,
);

const acceptAnAgreementUsecase = new AcceptAnAgreementUsecase(
  notifyPartyUsecase,
  prismaAgreementRepository,
);

const cancelAnAgreementUsecase = new CancelAnAgreementUsecase(
  notifyPartyUsecase,
  prismaAgreementRepository,
);

const denyAnAgreementUsecase = new DenyAnAgreementUsecase(
  notifyPartyUsecase,
  prismaAgreementRepository,
);

const getAgreementsUsecase = new GetAgreementsUsecase(
  prismaPartyRepository,
  prismaAgreementRepository,
);

const makeAnAgreementUsecase = new MakeAnAgreementUsecase(
  notifyPartyUsecase,
  prismaPartyRepository,
  prismaAgreementRepository,
);

const payAnAgreementUsecase = new PayAnAgreementUsecase(
  notifyPartyUsecase,
  prismaAgreementRepository,
);

const removeAnAgreementUsecase = new RemoveAnAgreementUsecase(prismaAgreementRepository);

export const getAgreementsController = new GetAgreementsController(getAgreementsUsecase);
export const payAnAgreementController = new PayAnAgreementController(payAnAgreementUsecase);
export const makeAnAgreementController = new MakeAnAgreementController(makeAnAgreementUsecase);
export const denyAnAgreementController = new DenyAnAgreementController(denyAnAgreementUsecase);
export const removeAnAgreementController = new RemoveAnAgreementController(
  removeAnAgreementUsecase,
);
export const acceptAnAgreementController = new AcceptAnAgreementController(
  acceptAnAgreementUsecase,
);
export const canceltAnAgreementController = new CancelAnAgreementController(
  cancelAnAgreementUsecase,
);
