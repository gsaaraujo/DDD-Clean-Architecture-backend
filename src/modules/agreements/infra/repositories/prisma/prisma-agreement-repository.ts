import { PrismaClient } from '@prisma/client';

import { Agreement } from '@agreements/domain/entities/agreement';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';

import { PrismaAgreementMapper } from '@agreements/infra/repositories/prisma/mappers/prisma-agreement-mapper';

export class PrismaAgreementRepository implements IAgreementRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async exists(id: string): Promise<boolean> {
    const agreement = await this.prismaClient.agreement.findUnique({
      where: { id },
    });

    return !!agreement;
  }

  async create(agreement: Agreement): Promise<Agreement> {
    const newAgreement = await this.prismaClient.agreement.create({
      data: PrismaAgreementMapper.toPersistence(agreement),
    });

    return PrismaAgreementMapper.toDomain(newAgreement);
  }

  async update(agreement: Agreement): Promise<Agreement> {
    const agreementUpdated = await this.prismaClient.agreement.update({
      where: { id: agreement.id },
      data: PrismaAgreementMapper.toPersistence(agreement),
    });

    return PrismaAgreementMapper.toDomain(agreementUpdated);
  }

  async findOneById(id: string): Promise<Agreement | null> {
    const agreement = await this.prismaClient.agreement.findUnique({
      where: { id },
    });

    if (!agreement) return null;
    return PrismaAgreementMapper.toDomain(agreement);
  }

  async findOneByIdAndPartyId(id: string, partyId: string): Promise<Agreement | null> {
    const agreement = await this.prismaClient.agreement.findFirst({
      where: {
        id,
        OR: [{ debtorPartyId: partyId }, { creditorPartyId: partyId }],
      },
    });

    if (!agreement) return null;
    return PrismaAgreementMapper.toDomain(agreement);
  }

  async findAllByPartyId(partyId: string): Promise<Agreement[]> {
    const agreements = await this.prismaClient.agreement.findMany({
      where: {
        OR: [{ debtorPartyId: partyId }, { creditorPartyId: partyId }],
      },
    });

    return agreements.map((agreement) => PrismaAgreementMapper.toDomain(agreement));
  }

  async delete(id: string): Promise<void> {
    await this.prismaClient.agreement.delete({ where: { id } });
  }
}
