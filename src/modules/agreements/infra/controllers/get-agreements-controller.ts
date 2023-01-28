import Joi from 'joi';
import {
  Get,
  Param,
  Inject,
  Controller,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Agreement } from '@agreements/domain/entities/agreement';
import { IGetAgreementsUsecase } from '@agreements/domain/usecases/get-agreements-usecase';

export type GetAgreementsControllerOutput = Agreement;

@Controller('agreements')
export class GetAgreementsController {
  public constructor(
    @Inject('IGetAgreementsUsecase')
    private readonly getAgreementsUsecase: IGetAgreementsUsecase,
  ) {}

  @Get('get-agreements/:partyId')
  async handle(@Param('partyId') partyId: string): Promise<GetAgreementsControllerOutput[]> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId });
    if (validationError) throw new BadRequestException(validationError.message);

    const agreementsOrError = await this.getAgreementsUsecase.execute({
      partyId,
    });

    if (agreementsOrError.isRight()) {
      const agreements = agreementsOrError.value;
      return agreements;
    }

    const error = agreementsOrError.value;

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'PartyNotFoundError':
          throw new NotFoundException(error.message);
      }
    }

    throw new InternalServerErrorException('Internal server error');
  }
}
