import {Operation} from "../operation";

export class Secans extends Operation {

  public evaluate(dict: any): number {
    return 1 / Math.cos(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Secans(this.operation.simplify());
  }
}
