import { HttpErrorResponse } from '../error-responses/http-error-response';

export class InternalServerError extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(500, message);
  }
}
