import { HttpResponse } from './http/http-response';

export interface Controller<I, O> {
  handle(request?: I): Promise<HttpResponse<O>>;
}
