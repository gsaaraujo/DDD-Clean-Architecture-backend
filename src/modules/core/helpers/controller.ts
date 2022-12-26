import { HttpResponse } from '@core/helpers/http/http-response';

export interface Controller<I, O> {
  handle(request?: I): Promise<HttpResponse<O>>;
}
