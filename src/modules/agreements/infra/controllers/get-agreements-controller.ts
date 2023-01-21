import Joi from 'joi';
import { Controller, Get, Inject } from '@nestjs/common';

import { Ok } from '@core/domain/http/status-codes/ok';
import { HttpResponse } from '@core/domain/http/http-response';
import { NotFound } from '@core/domain/http/status-codes/not-found';
import { BadRequest } from '@core/domain/http/status-codes/bad-request';
import { InternalServerError } from '@core/domain/http/status-codes/internal-server-error';

import { IGetAgreementsUsecase } from '@agreements/domain/usecases/get-agreements-usecase';

import {
  IGetAgreementsController,
  GetAgreementsControllerInput,
  GetAgreementsControllerOutput,
} from '@agreements/adapters/controllers/get-agreements-controller';

@Controller('agreements')
export class GetAgreementsController implements IGetAgreementsController {
  public constructor(
    @Inject('IGetAgreementsUsecase')
    private readonly getAgreementsUsecase: IGetAgreementsUsecase,
  ) {}

  @Get('get-agreements')
  async handle(
    input: GetAgreementsControllerInput,
  ): Promise<HttpResponse<GetAgreementsControllerOutput>> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) {
      return new BadRequest(validationError.message);
    }

    const agreementsOrError = await this.getAgreementsUsecase.execute({
      partyId: input.partyId,
    });

    if (agreementsOrError.isRight()) {
      const agreements = agreementsOrError.value;
      return new Ok(agreements);
    }

    const error = agreementsOrError.value;

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'PartyNotFoundError':
          return new NotFound(error.message);
      }
    }

    return new InternalServerError('Internal server error');
  }
}
