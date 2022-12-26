import { Post, Body, Controller } from '@nestjs/common';
import Joi from 'joi';

import { Ok } from '@core/helpers/http/status-codes/ok';
import { HttpResponse } from '@core/helpers/http/http-response';
import { Conflict } from '@core/helpers/http/status-codes/conflict';
import { NotFound } from '@core/helpers/http/status-codes/not-found';
import { BadRequest } from '@core/helpers/http/status-codes/bad-request';
import { InternalServerError } from '@core/helpers/http/status-codes/internal-server-error';

import { IMakeAnAgreementUsecase } from '@agreements/domain/usecases/make-an-agreement-usecase';

import {
  IMakeAnAgreementController,
  MakeAnAgreementControllerInput,
} from '@agreements/adapters/controllers/make-an-agreement-controller';

@Controller('agreements')
export class MakeAnAgreementController implements IMakeAnAgreementController {
  public constructor(private readonly makeAnAgreementUsecase: IMakeAnAgreementUsecase) {}

  @Post('make-an-agreement')
  async handle(@Body() input: MakeAnAgreementControllerInput): Promise<HttpResponse> {
    const schema = Joi.object({
      isCurrency: Joi.boolean(),
      amount: Joi.number().max(255),
      debtorPartyId: Joi.string().uuid(),
      creditorPartyId: Joi.string().uuid(),
      description: Joi.string().optional().max(255),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) {
      return new BadRequest(validationError.message);
    }

    const makeAnAgreementOrError = await this.makeAnAgreementUsecase.execute({
      amount: input.amount,
      isCurrency: input.isCurrency,
      description: input.description,
      debtorPartyId: input.debtorPartyId,
      creditorPartyId: input.creditorPartyId,
    });

    if (makeAnAgreementOrError.isRight()) return new Ok();

    const error = makeAnAgreementOrError.value;

    if (error.type === 'DomainError') {
      return new Conflict(error.message);
    }

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'CreditorPartyNotFoundError':
          return new NotFound(error.message);

        case 'DebtorPartyNotFoundError':
          return new NotFound(error.message);
      }
    }

    return new InternalServerError('Internal server error');
  }
}