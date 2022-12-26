import { Either } from '@core/helpers/either';
import { DomainError } from '@core/helpers/errors/domain-error';
import { ApplicationError } from '@core/helpers/errors/application-error';

export interface Usecase<I, O> {
  execute(input?: I): Promise<Either<DomainError | ApplicationError, O>>;
}
