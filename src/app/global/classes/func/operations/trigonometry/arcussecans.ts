import {Operation} from "../operation";

export class Arcussecans extends Operation {

  public evaluate(dict: any): number {
    return Math.acos(1 / this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
