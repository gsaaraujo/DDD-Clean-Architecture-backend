import { HttpResponse } from '@core/domain/http/http-response';

export interface Controller<I, O> {
  handle(input?: I): Promise<HttpResponse<O>>;
}
