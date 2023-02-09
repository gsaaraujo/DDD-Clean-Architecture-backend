import { UserDeviceToken as UserDeviceTokenORM } from '@prisma/client';

import { PartyDTO } from '@agreements/application/repositories/party-repository';

export class PrismaPartyMapper {
  public static toDTO(userDeviceTokenORM: UserDeviceTokenORM): PartyDTO {
    return {
      id: userDeviceTokenORM.userId,
      registrationToken: userDeviceTokenORM.userId,
    };
  }
}
