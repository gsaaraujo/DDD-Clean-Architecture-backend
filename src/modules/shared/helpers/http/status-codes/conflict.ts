import { HttpErrorResponse } from '../error-responses/http-error-response';

export class Conflict extends HttpErrorResponse {
  public constructor(public readonly message: string) {
    super(409, message);
  }
}
