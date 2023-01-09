import { PrismaClient } from '@prisma/client';

import { IPartyRepository } from '@agreements/adapters/repositories/party-repository';

export class PrismaPartyRepository implements IPartyRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async exists(id: string): Promise<boolean> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
    });

    return !!user;
  }
}
