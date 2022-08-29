import {Operation} from "../operation";

export class Logarithm extends Operation {

  public evaluate(dict: any): number {
    return Math.log(this.operation.evaluate(dict)) / Math.log(this.base.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation, private readonly base: Operation) {
    super();
    this.childOperations.push(this.operation, this.base);
  }

  public override simplify(): Operation {
    return new Logarithm(this.operation.simplify(), this.base.simplify());
  }
}
