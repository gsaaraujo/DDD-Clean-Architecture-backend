import { mock } from 'jest-mock-extended';

import { left, right } from '../../../core/helpers/either';
import { HttpResponseType } from '../../../core/helpers/http/http-response';

import { AcceptAnAgreementController } from './accept-an-agreement-controller';
import { AcceptAnAgreementControllerInput } from '../../adapters/controllers/accept-an-agreement-controller';

import { IAcceptAnAgreementUsecase } from '../../domain/usecases/accept-an-agreement-usecase';

import { CurrentStatusMustBePendingError } from '../../domain/errors/current-status-must-be-pending-error';
import { PartyNotFoundError } from '../../application/errors/party-not-found-error';
import { AgreementNotFoundError } from '../../application/errors/agreement-not-found-error';

describe('AcceptAnAgreementController', () => {
  let acceptAnAgreementController: AcceptAnAgreementController;
  let mockAcceptAnAgreementUsecase: IAcceptAnAgreementUsecase;

  beforeEach(async () => {
    mockAcceptAnAgreementUsecase = mock<IAcceptAnAgreementUsecase>();
    acceptAnAgreementController = new AcceptAnAgreementController(mockAcceptAnAgreementUsecase);
  });

  it('should return OK', async () => {
    const input: AcceptAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest.spyOn(mockAcceptAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await acceptAnAgreementController.handle(input);

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const input: AcceptAnAgreementControllerInput = {
      partyId: 'aabbcc112233ggg',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    const sut = await acceptAnAgreementController.handle(input);

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const input: AcceptAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'kkkool3333kdd88k',
    };

    const sut = await acceptAnAgreementController.handle(input);

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return Conflict if usecase returns a DomainError', async () => {
    const input: AcceptAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CurrentStatusMustBePendingError('')));

    const sut = await acceptAnAgreementController.handle(input);

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns PartyNotFoundError', async () => {
    const input: AcceptAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = await acceptAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith(input);
  });

  it('should return NotFound if usecase returns AgreementNotFoundError', async () => {
    const input: AcceptAnAgreementControllerInput = {
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    };

    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = await acceptAnAgreementController.handle(input);

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledTimes(1);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith(input);
  });
});
