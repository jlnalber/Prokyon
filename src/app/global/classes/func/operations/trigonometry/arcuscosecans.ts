import {Operation} from "../operation";

export class Arcuscosecans extends Operation {

  public evaluate(dict: any): number {
    return Math.asin(1 / this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Arcuscosecans(this.operation.simplify());
  }
}
