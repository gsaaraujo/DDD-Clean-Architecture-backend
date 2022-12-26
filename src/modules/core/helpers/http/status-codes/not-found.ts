import { HttpErrorResponse } from '../error-responses/http-error-response';

export class NotFound extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(404, message);
  }
}
