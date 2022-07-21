import {Operation} from "../operation";

export class Arcuscosinus extends Operation {

  public evaluate(dict: any): number {
    return Math.acos(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
