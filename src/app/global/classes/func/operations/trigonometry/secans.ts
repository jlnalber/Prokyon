import {Operation} from "../operation";

export class Secans extends Operation {

  public evaluate(dict: any): number {
    return 1 / Math.cos(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
