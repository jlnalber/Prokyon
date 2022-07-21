import {Operation} from "../operation";

export class Cosecans extends Operation {

  public evaluate(dict: any): number {
    return 1 / Math.sin(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
