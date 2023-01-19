import { mock } from 'jest-mock-extended';

import { MockApplicationError } from '@test/mocks/mock-application-error';

import { left, right } from '@core/domain/helpers/either';
import { HttpResponseType } from '@core/domain/http/http-response';

import { IMakeAnAgreementUsecase } from '@agreements/domain/usecases/make-an-agreement-usecase';
import { CreditorAndDebtorCannotBeTheSameError } from '@agreements/domain/errors/creditor-and-debtor-cannot-be-the-same-error';

import { DebtorPartyNotFoundError } from '@agreements/application/errors/debtor-party-not-found-error';
import { CreditorPartyNotFoundError } from '@agreements/application/errors/creditor-party-not-found-error';

import { MakeAnAgreementController } from '@agreements/infra/controllers/make-an-agreement-controller';

describe('MakeAnAgreementController', () => {
  let makeAnAgreementController: MakeAnAgreementController;
  let mockMakeAnAgreementUsecase: IMakeAnAgreementUsecase;

  beforeEach(() => {
    mockMakeAnAgreementUsecase = mock<IMakeAnAgreementUsecase>();
    makeAnAgreementController = new MakeAnAgreementController(mockMakeAnAgreementUsecase);
  });

  it('should return OK', async () => {
    jest.spyOn(mockMakeAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await makeAnAgreementController.handle({
      amount: 2,
      isCurrency: true,
      description: 'any description',
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      description: 'any description',
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return Conflict if usecase returns a DomainError', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CreditorAndDebtorCannotBeTheSameError('')));

    const sut = await makeAnAgreementController.handle({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return NotFound if usecase returns CreditorPartyNotFoundError', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CreditorPartyNotFoundError('')));

    const sut = await makeAnAgreementController.handle({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return NotFound if usecase returns DebtorPartyNotFoundError', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new DebtorPartyNotFoundError('')));

    const sut = await makeAnAgreementController.handle({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });

  it('should return InternalServerError if usecase returns a unexpected application error', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockApplicationError()));

    const sut = await makeAnAgreementController.handle({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });

    expect(sut.status).toBe(500);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '10427361-4c02-4ba9-8fb3-8fbc05141bf2',
      creditorPartyId: 'bfbe9768-dc26-4bdb-9ec8-d15906accf6d',
    });
  });
});
