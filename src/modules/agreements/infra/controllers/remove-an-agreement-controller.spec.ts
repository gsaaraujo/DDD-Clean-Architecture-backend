import { mock } from 'jest-mock-extended';

import { MockDomainError } from '@test/mocks/mock-domain-error';

import { left, right } from '@core/domain/helpers/either';
import { HttpResponseType } from '@core/domain/http/http-response';

import { IRemoveAnAgreementUsecase } from '@agreements/domain/usecases/remove-an-agreement-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { CannotRemoveAgreementError } from '@agreements/application/errors/cannot-remove-agreement-error';

import { RemoveAnAgreementController } from '@agreements/infra/controllers/remove-an-agreement-controller';

describe('remove-an-agreement-controller', () => {
  let removeAgreementsController: RemoveAnAgreementController;
  let mockRemoveAnAgreementsUsecase: IRemoveAnAgreementUsecase;

  beforeEach(() => {
    mockRemoveAnAgreementsUsecase = mock<IRemoveAnAgreementUsecase>();
    removeAgreementsController = new RemoveAnAgreementController(mockRemoveAnAgreementsUsecase);
  });

  it('should return Ok', async () => {
    jest.spyOn(mockRemoveAnAgreementsUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await removeAgreementsController.handle({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const sut = await removeAgreementsController.handle({
      partyId: 'aabbcc112233ggg',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return BadRequest if agreementId is not UUID', async () => {
    const sut = await removeAgreementsController.handle({
      partyId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
      agreementId: 'aabbcc112233ggg',
    });

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return Conflict if usecase returns any DomainError', async () => {
    jest
      .spyOn(mockRemoveAnAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = await removeAgreementsController.handle({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockRemoveAnAgreementsUsecase.execute).toBeCalledWith({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });
  });

  it('should return NotFound if usecase returns AgreementNotFoundError', async () => {
    jest
      .spyOn(mockRemoveAnAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = await removeAgreementsController.handle({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockRemoveAnAgreementsUsecase.execute).toBeCalledWith({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });
  });

  it('should return Conflict if usecase returns CannotRemoveAgreementError', async () => {
    jest
      .spyOn(mockRemoveAnAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(left(new CannotRemoveAgreementError('')));

    const sut = await removeAgreementsController.handle({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });

    expect(sut.status).toBe(409);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockRemoveAnAgreementsUsecase.execute).toBeCalledWith({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
      agreementId: '68ed8204-db1e-46dd-b323-c9d7793cc3d9',
    });
  });
});
