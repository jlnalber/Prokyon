import {Operation} from "./operation";

export class NaturalLogarithm extends Operation {

  public evaluate(dict: any): number {
    return Math.log(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
