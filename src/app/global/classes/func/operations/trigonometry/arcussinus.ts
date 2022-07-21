import {Operation} from "../operation";

export class Arcussinus extends Operation {

  public evaluate(dict: any): number {
    return Math.asin(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
