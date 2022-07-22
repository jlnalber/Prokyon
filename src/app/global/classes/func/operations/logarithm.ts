import {Operation} from "./operation";

export class Logarithm extends Operation {

  public evaluate(dict: any): number {
    return Math.log(this.operation.evaluate(dict)) / Math.log(this.base.evaluate(dict));
  }

  constructor(private readonly operation: Operation, private readonly base: Operation) {
    super();
  }
}
