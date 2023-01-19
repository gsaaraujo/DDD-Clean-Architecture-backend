import { mock } from 'jest-mock-extended';

import { MockApplicationError } from '@test/mocks/mock-application-error';

import { left, right } from '@core/domain/helpers/either';
import { HttpResponseType } from '@core/domain/http/http-response';

import { IAcceptAnAgreementUsecase } from '@agreements/domain/usecases/accept-an-agreement-usecase';
import { CurrentStatusMustBePendingError } from '@agreements/domain/errors/current-status-must-be-pending-error';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { AcceptAnAgreementController } from '@agreements/infra/controllers/accept-an-agreement-controller';

import { AcceptAnAgreementControllerInput } from '@agreements/adapters/controllers/accept-an-agreement-controller';

describe('AcceptAnAgreementController', () => {
  let acceptAnAgreementController: AcceptAnAgreementController;
  let mockAcceptAnAgreementUsecase: IAcceptAnAgreementUsecase;

  beforeEach(() => {
    mockAcceptAnAgreementUsecase = mock<IAcceptAnAgreementUsecase>();
    acceptAnAgreementController = new AcceptAnAgreementController(mockAcceptAnAgreementUsecase);
  });

  it('should return OK', async () => {
    jest.spyOn(mockAcceptAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await acceptAnAgreementController.handle({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
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

  it('should return BadRequest if agreementId is not UUID', async () => {
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
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CurrentStatusMustBePendingError('')));

    const sut = await acceptAnAgreementController.handle({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return NotFound if usecase returns PartyNotFoundError', async () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = await acceptAnAgreementController.handle({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return NotFound if usecase returns AgreementNotFoundError', async () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = await acceptAnAgreementController.handle({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return InternalServerError if usecase returns a unexpected application error', async () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockApplicationError()));

    const sut = await acceptAnAgreementController.handle({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(500);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      agreementId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });
});
