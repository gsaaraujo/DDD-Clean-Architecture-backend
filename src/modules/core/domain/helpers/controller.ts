import { HttpResponse } from '@core/domain/http/http-response';

export interface Controller<I, O> {
  handle(request?: I): Promise<HttpResponse<O>>;
}
