import { HttpSuccessResponse } from '@core/domain/http/successful-responses/http-successful-response';

export class Created<T> extends HttpSuccessResponse<T> {
  public constructor(public readonly body?: T) {
    super(201, body);
  }
}
