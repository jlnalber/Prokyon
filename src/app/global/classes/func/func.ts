import {Operation} from "./operations/operation";

export class Func {
  constructor(private readonly operation: Operation) { }

  public evaluate(x: number): number {
    return this.operation.evaluate({ 'x': x });
  }
}
