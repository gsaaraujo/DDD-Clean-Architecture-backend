import { Either } from './either';
import { BaseError } from './base-error';

export interface Usecase<I, O> {
  execute(input?: I): Promise<Either<BaseError, O>>;
}
