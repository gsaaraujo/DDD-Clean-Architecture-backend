import { mock } from 'jest-mock-extended';

import { left, right } from '../../../../shared/helpers/either';
import { HttpResponseType } from '../../../../shared/helpers/http/http-response';

import { MakeAnAgreementController } from './make-an-agreement-controller';
import { MakeAnAgreementControllerInput } from '../../../adapters/controllers/make-an-agreement-controller';

import { IMakeAnAgreementUsecase } from '../../../domain/usecases/make-an-agreement-usecase';

import { CreditorPartyNotFoundError } from '../../../application/errors/creditor-party-not-found-error';

describe('MakeAnAgreementController', () => {
  let makeAnAgreementController: MakeAnAgreementController;
  let mockMakeAnAgreementUsecase: IMakeAnAgreementUsecase;

  beforeEach(async () => {
    mockMakeAnAgreementUsecase = mock<IMakeAnAgreementUsecase>();
    makeAnAgreementController = new MakeAnAgreementController(mockMakeAnAgreementUsecase);
  });

  it('should return OK', async () => {
    const input: MakeAnAgreementControllerInput = {
      amount: 2,
      isCurrency: true,
      description: 'any description',
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest.spyOn(mockMakeAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await makeAnAgreementController.handle(input);

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns CreditorPartyNotFoundError', async () => {
    const input: MakeAnAgreementControllerInput = {
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CreditorPartyNotFoundError('')));

    const sut = await makeAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith(input);
  });
});
