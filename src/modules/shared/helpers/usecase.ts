export interface Usecase<I, O> {
  execute(input?: I): Promise<O>;
}
