import { mock } from 'jest-mock-extended';

import { makeAgreement } from '@test/factories/agreement-factory';

import { left, right } from '@core/domain/helpers/either';
import { HttpResponseType } from '@core/domain/http/http-response';

import { IGetAgreementsUsecase } from '@agreements/domain/usecases/get-agreements-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';

import { GetAgreementsController } from '@agreements/infra/controllers/get-agreements-controller';

describe('get-agreements-controller', () => {
  let getAgreementsController: GetAgreementsController;
  let mockGetAgreementsUsecase: IGetAgreementsUsecase;

  beforeEach(() => {
    mockGetAgreementsUsecase = mock<IGetAgreementsUsecase>();
    getAgreementsController = new GetAgreementsController(mockGetAgreementsUsecase);
  });

  it('should return Ok if usecase returns a list of agreements', async () => {
    const agreement1 = makeAgreement({ creditorPartyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796' });
    const agreement2 = makeAgreement({ creditorPartyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796' });

    jest
      .spyOn(mockGetAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(right([agreement1, agreement2]));

    const sut = await getAgreementsController.handle({
      partyId: 'df061cf8-4444-4b52-b7d4-f2d6fb8cd796',
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toStrictEqual([agreement1, agreement2]);
    expect(sut.type).toStrictEqual(HttpResponseType.SUCCESS);
  });

  it('should return BadRequest if partyId is not UUID', async () => {
    const sut = await getAgreementsController.handle({ partyId: 'aabbcc112233ggg' });

    expect(sut.status).toBe(400);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
  });

  it('should return NotFound if usecase returns PartyNotFoundError', async () => {
    jest
      .spyOn(mockGetAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = await getAgreementsController.handle({
      partyId: 'c6809672-1ce4-425a-b942-e7d09f488bc5',
    });

    expect(sut.status).toBe(404);
    expect(sut.body).toBeUndefined();
    expect(sut.type).toStrictEqual(HttpResponseType.ERROR);
    expect(mockGetAgreementsUsecase.execute).toBeCalledTimes(1);
    expect(mockGetAgreementsUsecase.execute).toBeCalledWith({
      partyId: 'c6809672-1ce4-425a-b942-e7d09f488bc5',
    });
  });
});
