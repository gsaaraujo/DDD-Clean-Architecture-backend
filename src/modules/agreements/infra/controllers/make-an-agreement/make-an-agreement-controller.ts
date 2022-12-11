import { Post, Body, Controller } from '@nestjs/common';
import Joi from 'joi';

import { Ok } from '../../../../shared/helpers/http/status-codes/ok';
import { HttpResponse } from '../../../../shared/helpers/http/http-response';
import { Conflict } from '../../../../shared/helpers/http/status-codes/conflict';
import { NotFound } from '../../../../shared/helpers/http/status-codes/not-found';
import { BadRequest } from '../../../../shared/helpers/http/status-codes/bad-request';
import { InternalServerError } from '../../../../shared/helpers/http/status-codes/internal-server-error';

import { IMakeAnAgreementUsecase } from '../../../domain/usecases/make-an-agreement-usecase';

import {
  IMakeAnAgreementController,
  MakeAnAgreementControllerInput,
} from '../../../adapters/controllers/make-an-agreement-controller';

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

    switch (error.type) {
      case 'CreditorPartyNotFoundError':
        return new NotFound(error.message);

      case 'DebtorPartyNotFoundError':
        return new NotFound(error.message);

      case 'ItemAmountLimitError':
        return new Conflict(error.message);

      case 'CreditorAndDebtorCannotBeTheSameError':
        return new Conflict(error.message);

      case 'CurrencyItemAmountLimitError':
        return new Conflict(error.message);

      case 'CurrencyAmountMustBeInCentsError':
        return new Conflict(error.message);

      case 'CurrentStatusMustBeAcceptedError':
        return new Conflict(error.message);

      case 'CurrentStatusMustBeOfferedError':
        return new Conflict(error.message);

      case 'CurrentStatusMustBePendingError':
        return new Conflict(error.message);

      case 'PartyConsentAgreementMustInitiateAsPendingError':
        return new Conflict(error.message);

      default:
        return new InternalServerError('Internal server error');
    }
  }
}
