import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

import { IPartyRepository, PartyDTO } from '@agreements/application/repositories/party-repository';
import { PartyMapper } from '@agreements/infra/repositories/prisma/mappers/prisma-party-repository';

export class PrismaPartyRepository implements IPartyRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async exists(id: string): Promise<boolean> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
    });

    return !!user;
  }

  async create(partyDTO: PartyDTO): Promise<PartyDTO> {
    const newParty = await this.prismaClient.userDeviceToken.create({
      data: {
        id: randomUUID(),
        userId: partyDTO.id,
        token: partyDTO.registrationToken,
      },
    });

    return PartyMapper.toDTO(newParty);
  }

  async findOneRegistrationTokenByPartyId(partyId: string): Promise<string | null> {
    const userDeviceToken = await this.prismaClient.userDeviceToken.findUnique({
      where: { id: partyId },
    });

    if (!userDeviceToken) return null;
    return userDeviceToken.token;
  }
}
