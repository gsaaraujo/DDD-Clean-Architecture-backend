import { HttpErrorResponse } from '@core/helpers/http/error-responses/http-error-response';

export class InternalServerError extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(500, message);
  }
}