import {Operation} from "../operation";

export class Arcussinus extends Operation {

  public evaluate(dict: any): number {
    return Math.asin(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Arcussinus(this.operation.simplify());
  }
}
