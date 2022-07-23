import {Operation} from "./operations/operation";

export class Func {
  constructor(private readonly operation: Operation) { }

  public evaluate(x: number): number {
    return this.operation.evaluate({ 'x': x });
  }

  public derive(): Func {
    return new Func(this.operation.derive());
  }

  public simplify(): Func {
    return new Func(this.operation.simplify());
  }

  public get operationAsString(): string {
    return this.operation.toString();
  }
}
