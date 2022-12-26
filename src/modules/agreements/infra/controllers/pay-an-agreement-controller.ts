import Joi from 'joi';

import { Ok } from '@core/helpers/http/status-codes/ok';
import { HttpResponse } from '@core/helpers/http/http-response';
import { Conflict } from '@core/helpers/http/status-codes/conflict';
import { NotFound } from '@core/helpers/http/status-codes/not-found';
import { BadRequest } from '@core/helpers/http/status-codes/bad-request';
import { InternalServerError } from '@core/helpers/http/status-codes/internal-server-error';

import { IPayAnAgreementUsecase } from '@agreements/domain/usecases/pay-an-agreement-usecase';

import {
  IPayAnAgreementController,
  PayAnAgreementControllerInput,
} from '@agreements/adapters/controllers/pay-an-agreement-controller';

export class PayAnAgreementController implements IPayAnAgreementController {
  public constructor(private readonly payAnAgreementUsecase: IPayAnAgreementUsecase) {}

  async handle(input: PayAnAgreementControllerInput): Promise<HttpResponse<void>> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) {
      return new BadRequest(validationError.message);
    }

    const payAnAgreementOrError = await this.payAnAgreementUsecase.execute({
      partyId: input.partyId,
      agreementId: input.agreementId,
    });

    if (payAnAgreementOrError.isRight()) return new Ok();

    const error = payAnAgreementOrError.value;

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
