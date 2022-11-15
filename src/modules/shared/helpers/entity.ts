import { v4 as uuidv4 } from 'uuid';

export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;

  protected constructor(props: T, id?: string) {
    this.props = props;
    this._id = id ?? uuidv4();
  }

  public isEquals(object: Entity<T>): boolean {
    return this._id === object._id;
  }

  public get id(): string {
    return this._id;
  }
}
