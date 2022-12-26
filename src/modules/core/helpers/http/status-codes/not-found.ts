import { HttpErrorResponse } from '@core/helpers/http/error-responses/http-error-response';

export class NotFound extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(404, message);
  }
}
