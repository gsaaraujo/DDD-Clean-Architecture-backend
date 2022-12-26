import Joi from 'joi';

import { Ok } from '@core/helpers/http/status-codes/ok';
import { HttpResponse } from '@core/helpers/http/http-response';
import { Conflict } from '@core/helpers/http/status-codes/conflict';
import { NotFound } from '@core/helpers/http/status-codes/not-found';
import { BadRequest } from '@core/helpers/http/status-codes/bad-request';
import { InternalServerError } from '@core/helpers/http/status-codes/internal-server-error';

import { IAcceptAnAgreementUsecase } from '@agreements/domain/usecases/accept-an-agreement-usecase';

import {
  AcceptAnAgreementControllerInput,
  IAcceptAnAgreementController,
} from '@agreements/adapters/controllers/accept-an-agreement-controller';

export class AcceptAnAgreementController implements IAcceptAnAgreementController {
  public constructor(private readonly acceptAnAgreementUsecase: IAcceptAnAgreementUsecase) {}

  async handle(input: AcceptAnAgreementControllerInput): Promise<HttpResponse<void>> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) {
      return new BadRequest(validationError.message);
    }

    const acceptAnAgreementOrError = await this.acceptAnAgreementUsecase.execute({
      partyId: input.partyId,
      agreementId: input.agreementId,
    });

    if (acceptAnAgreementOrError.isRight()) return new Ok();

    const error = acceptAnAgreementOrError.value;

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