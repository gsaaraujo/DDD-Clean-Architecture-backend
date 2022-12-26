import { HttpSuccessResponse } from '@core/helpers/http/successful-responses/http-successful-response';

export class Ok<T> extends HttpSuccessResponse<T> {
  public constructor(public readonly body?: T) {
    super(200, body);
  }
}