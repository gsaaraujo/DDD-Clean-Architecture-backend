import {
  Post,
  Body,
  Controller,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';

import { MakeAnAgreementInput } from './make-an-agreement-input';
import { IMakeAnAgreementUsecase } from '../../../domain/usecases/make-an-agreement-usecase';

@Controller('agreements')
export class MakeAnAgreementController {
  public constructor(
    @Inject('IMakeAnAgreementUsecase')
    private readonly makeAnAgreementUsecase: IMakeAnAgreementUsecase,
  ) {}

  @Post()
  public async handle(@Body() input: MakeAnAgreementInput): Promise<void> {
    const makeAnAgreementOrError = await this.makeAnAgreementUsecase.execute({
      amount: input.amount,
      isCurrency: input.isCurrency,
      description: input.description,
      debtorPartyId: input.debtorPartyId,
      creditorPartyId: input.creditorPartyId,
    });

    if (makeAnAgreementOrError.isRight()) return;

    const error = makeAnAgreementOrError.value;

    switch (error.type) {
      case 'CreditorPartyNotFoundError':
        throw new NotFoundException(error.message);

      case 'DebtorPartyNotFoundError':
        throw new NotFoundException(error.message);

      case 'ItemAmountLimitError':
        throw new ConflictException(error.message);

      case 'CreditorAndDebtorCannotBeTheSameError':
        throw new ConflictException(error.message);

      case 'CurrencyItemAmountLimitError':
        throw new ConflictException(error.message);

      case 'CurrencyAmountMustBeInCentsError':
        throw new ConflictException(error.message);

      case 'CurrentStatusMustBeAcceptedError':
        throw new ConflictException(error.message);

      case 'CurrentStatusMustBeOfferedError':
        throw new ConflictException(error.message);

      case 'CurrentStatusMustBePendingError':
        throw new ConflictException(error.message);

      case 'PartyConsentAgreementMustInitiateAsPendingError':
        throw new ConflictException(error.message);

      default:
        throw new InternalServerErrorException();
    }
  }
}
