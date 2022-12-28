import { mock } from 'jest-mock-extended';

import { left, right } from '@core/domain/helpers/either';
import { HttpResponseType } from '@core/domain/http/http-response';

import { ICancelAnAgreementUsecase } from '@agreements/domain/usecases/cancel-an-agreement-usecase';
import { CurrentStatusMustBeAcceptedError } from '@agreements/domain/errors/current-status-must-be-accepted-error';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { CancelAnAgreementController } from '@agreements/infra/controllers/cancel-an-agreement-controller';

import { CancelAnAgreementControllerInput } from '@agreements/adapters/controllers/cancel-an-agreement-controller';

describe('CancelAnAgreementController', () => {
  let cancelAnAgreementController: CancelAnAgreementController;
  let mockCancelAnAgreementUsecase: ICancelAnAgreementUsecase;

  beforeEach(async () => {
    mockCancelAnAgreementUsecase = mock<ICancelAnAgreementUsecase>();
    cancelAnAgreementController = new CancelAnAgreementController(mockCancelAnAgreementUsecase);
  });

  it('should return OK', async () => {
    const input: CancelAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest.spyOn(mockCancelAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await cancelAnAgreementController.handle(input);

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const input: CancelAnAgreementControllerInput = {
      partyId: 'aabbcc112233ggg',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    const sut = await cancelAnAgreementController.handle(input);

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const input: CancelAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'kkkool3333kdd88k',
    };

    const sut = await cancelAnAgreementController.handle(input);

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return Conflict if usecase returns a DomainError', async () => {
    const input: CancelAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CurrentStatusMustBeAcceptedError('')));

    const sut = await cancelAnAgreementController.handle(input);

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns PartyNotFoundError', async () => {
    const input: CancelAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = await cancelAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns AgreementNotFoundError', async () => {
    const input: CancelAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = await cancelAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith(input);
  });
});
