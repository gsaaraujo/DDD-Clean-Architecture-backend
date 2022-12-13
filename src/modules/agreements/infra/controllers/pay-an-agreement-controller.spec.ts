import { mock } from 'jest-mock-extended';

import { left, right } from '../../../shared/helpers/either';
import { HttpResponseType } from '../../../shared/helpers/http/http-response';

import { PayAnAgreementController } from './pay-an-agreement-controller';
import { PayAnAgreementControllerInput } from '../../adapters/controllers/pay-an-agreement-controller';

import { IPayAnAgreementUsecase } from '../../domain/usecases/pay-an-agreement-usecase';
import { CurrentStatusMustBeAcceptedError } from '../../domain/errors/current-status-must-be-accepted-error';

import { PartyNotFoundError } from '../../application/errors/party-not-found-error';
import { AgreementNotFoundError } from '../../application/errors/agreement-not-found-error';

describe('PayAnAgreementController', () => {
  let payAnAgreementController: PayAnAgreementController;
  let mockPayAnAgreementUsecase: IPayAnAgreementUsecase;

  beforeEach(async () => {
    mockPayAnAgreementUsecase = mock<IPayAnAgreementUsecase>();
    payAnAgreementController = new PayAnAgreementController(mockPayAnAgreementUsecase);
  });

  it('should return OK', async () => {
    const input: PayAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest.spyOn(mockPayAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await payAnAgreementController.handle(input);

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const input: PayAnAgreementControllerInput = {
      partyId: 'aabbcc112233ggg',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    const sut = await payAnAgreementController.handle(input);

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const input: PayAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'kkkool3333kdd88k',
    };

    const sut = await payAnAgreementController.handle(input);

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return Conflict if usecase returns a DomainError', async () => {
    const input: PayAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CurrentStatusMustBeAcceptedError('')));

    const sut = await payAnAgreementController.handle(input);

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns PartyNotFoundError', async () => {
    const input: PayAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = await payAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns AgreementNotFoundError', async () => {
    const input: PayAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = await payAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith(input);
  });
});
