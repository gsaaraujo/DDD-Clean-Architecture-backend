import { Either } from './either';
import { DomainError } from './errors/domain-error';
import { ApplicationError } from './errors/application-error';

export interface Usecase<I, O> {
  execute(input?: I): Promise<Either<DomainError | ApplicationError, O>>;
}
