import Joi from 'joi';
import { Controller, Patch } from '@nestjs/common';

import { Ok } from '@core/domain/http/status-codes/ok';
import { HttpResponse } from '@core/domain/http/http-response';
import { Conflict } from '@core/domain/http/status-codes/conflict';
import { NotFound } from '@core/domain/http/status-codes/not-found';
import { BadRequest } from '@core/domain/http/status-codes/bad-request';
import { InternalServerError } from '@core/domain/http/status-codes/internal-server-error';

import { IDenyAnAgreementUsecase } from '@agreements/domain/usecases/deny-an-agreement-usecase';

import {
  DenyAnAgreementControllerInput,
  IDenyAnAgreementController,
} from '@agreements/adapters/controllers/deny-an-agreement-controller';

@Controller('agreements')
export class DenyAnAgreementController implements IDenyAnAgreementController {
  public constructor(private readonly denyAnAgreementUsecase: IDenyAnAgreementUsecase) {}

  @Patch('deny-an-agreement')
  async handle(input: DenyAnAgreementControllerInput): Promise<HttpResponse<void>> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) {
      return new BadRequest(validationError.message);
    }

    const denyAnAgreementOrError = await this.denyAnAgreementUsecase.execute({
      partyId: input.partyId,
      agreementId: input.agreementId,
    });

    if (denyAnAgreementOrError.isRight()) return new Ok();

    const error = denyAnAgreementOrError.value;

    if (error.type === 'DomainError') {
      return new Conflict(error.message);
    }

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'PartyNotFoundError':
          return new NotFound(error.message);

        case 'AgreementNotFoundError':
          return new NotFound(error.message);
      }
    }

    return new InternalServerError('Internal server error');
  }
}
