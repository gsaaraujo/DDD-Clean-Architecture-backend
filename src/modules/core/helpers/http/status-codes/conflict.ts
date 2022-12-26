import { HttpErrorResponse } from '@core/helpers/http/error-responses/http-error-response';

export class Conflict extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(409, message);
  }
}
