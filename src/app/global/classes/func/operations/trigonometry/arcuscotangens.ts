import {Operation} from "../operation";

export class Arcuscotangens extends Operation {

  public evaluate(dict: any): number {
    return Math.atan(1 / this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
