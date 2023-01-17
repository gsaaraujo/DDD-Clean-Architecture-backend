import Joi from 'joi';

import { Ok } from '@core/domain/http/status-codes/ok';
import { HttpResponse } from '@core/domain/http/http-response';
import { Conflict } from '@core/domain/http/status-codes/conflict';
import { NotFound } from '@core/domain/http/status-codes/not-found';
import { BadRequest } from '@core/domain/http/status-codes/bad-request';
import { InternalServerError } from '@core/domain/http/status-codes/internal-server-error';

import { IRemoveAnAgreementUsecase } from '@agreements/domain/usecases/remove-an-agreement-usecase';

import {
  IRemoveAnAgreementController,
  RemoveAnAgreementControllerInput,
} from '@agreements/adapters/controllers/remove-an-agreement-controller';

export class RemoveAnAgreementController implements IRemoveAnAgreementController {
  public constructor(private readonly removeAnAgreementUsecase: IRemoveAnAgreementUsecase) {}

  async handle(input: RemoveAnAgreementControllerInput): Promise<HttpResponse<void>> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) {
      return new BadRequest(validationError.message);
    }

    const removeAnAgreementOrError = await this.removeAnAgreementUsecase.execute({
      partyId: input.partyId,
      agreementId: input.agreementId,
    });

    if (removeAnAgreementOrError.isRight()) return new Ok();

    const error = removeAnAgreementOrError.value;

    if (error.type === 'DomainError') {
      return new Conflict(error.message);
    }

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'AgreementNotFoundError':
          return new NotFound(error.message);

        case 'CannotRemoveAgreementError':
          return new Conflict(error.message);
      }
    }

    return new InternalServerError('Internal server error');
  }
}
