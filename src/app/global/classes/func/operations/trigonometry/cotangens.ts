import {Operation} from "../operation";

export class Cotangens extends Operation {

  public evaluate(dict: any): number {
    return 1 / Math.tan(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Cotangens(this.operation.simplify());
  }
}
