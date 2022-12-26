import { HttpResponse, HttpResponseType } from '@core/helpers/http/http-response';

export abstract class HttpSuccessResponse<T> extends HttpResponse<T> {
  protected constructor(public readonly status: number, public readonly body?: T) {
    super(HttpResponseType.SUCCESS, status, body);
  }
}
