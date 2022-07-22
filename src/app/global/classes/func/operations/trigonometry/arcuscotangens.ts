import {Operation} from "../operation";

export class Arcuscotangens extends Operation {

  public evaluate(dict: any): number {
    return Math.PI / 2 - Math.atan(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
