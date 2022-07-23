import {Operation} from "../operation";

export class Arcuscosinus extends Operation {

  public evaluate(dict: any): number {
    return Math.acos(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Arcuscosinus(this.operation.simplify());
  }
}
