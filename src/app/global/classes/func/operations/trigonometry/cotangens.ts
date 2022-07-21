import {Operation} from "../operation";

export class Cotangens extends Operation {

  public evaluate(dict: any): number {
    return 1 / Math.tan(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
