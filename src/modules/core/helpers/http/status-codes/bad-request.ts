import { HttpErrorResponse } from '@core/helpers/http/error-responses/http-error-response';

export class BadRequest extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(400, message);
  }
}
