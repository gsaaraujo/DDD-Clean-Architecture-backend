import { HttpErrorResponse } from '@core/domain/http/error-responses/http-error-response';

export class NotFound extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(404, message);
  }
}
