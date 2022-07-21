import {Operation} from "../operation";

export class Arcuscosecans extends Operation {

  public evaluate(dict: any): number {
    return Math.asin(1 / this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
