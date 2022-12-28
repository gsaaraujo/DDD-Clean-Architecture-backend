export enum HttpResponseType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export abstract class HttpResponse<T = undefined> {
  protected constructor(
    public readonly type: HttpResponseType,
    public readonly status: number,
    public readonly body?: T,
    public readonly message?: string,
  ) {}
}
