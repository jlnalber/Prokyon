import {Operation} from "../operation";

export class Cosinus extends Operation {

  public evaluate(dict: any): number {
    return Math.cos(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
