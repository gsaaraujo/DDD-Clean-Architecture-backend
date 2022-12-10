import { HttpResponse, HttpResponseType } from '../http-response';

export abstract class HttpErrorResponse extends HttpResponse {
  protected constructor(public readonly status: number, public readonly message: string) {
    super(HttpResponseType.ERROR, status, undefined, message);
  }
}
