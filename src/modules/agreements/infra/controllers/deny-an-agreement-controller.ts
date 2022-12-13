import Joi from 'joi';

import { Ok } from '../../../shared/helpers/http/status-codes/ok';
import { HttpResponse } from '../../../shared/helpers/http/http-response';
import { Conflict } from '../../../shared/helpers/http/status-codes/conflict';
import { NotFound } from '../../../shared/helpers/http/status-codes/not-found';
import { BadRequest } from '../../../shared/helpers/http/status-codes/bad-request';
import { InternalServerError } from '../../../shared/helpers/http/status-codes/internal-server-error';

import { IDenyAnAgreementUsecase } from '../../domain/usecases/deny-an-agreement-usecase';

import {
  DenyAnAgreementControllerInput,
  IDenyAnAgreementController,
} from '../../adapters/controllers/deny-an-agreement-controller';

export class DenyAnAgreementController implements IDenyAnAgreementController {
  public constructor(private readonly denyAnAgreementUsecase: IDenyAnAgreementUsecase) {}

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
