export abstract class BaseError {
  protected readonly _type: string;
  protected readonly _message: string;

  protected constructor(type: string, message: string) {
    this._type = type;
    this._message = message;
  }

  public get type(): string {
    return this._type;
  }

  public get message(): string {
    return this._message;
  }
}
