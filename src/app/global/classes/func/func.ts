import {Operation} from "./operations/operation";

export class Func {
  constructor(private readonly operation: Operation) { }

  public evaluate(x: number): number {
    return this.operation.evaluate({ ...defaultDict, 'x': x });
  }
}

export const defaultDict: any = {
  'e': Math.E,
  'pi': Math.PI,
  'π': Math.PI
}
