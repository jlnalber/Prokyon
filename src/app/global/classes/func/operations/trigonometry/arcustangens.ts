import {Operation} from "../operation";

export class Arcustangens extends Operation {

  public evaluate(dict: any): number {
    return Math.atan(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
