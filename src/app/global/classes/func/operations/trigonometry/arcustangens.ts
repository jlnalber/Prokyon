import {Operation} from "../operation";

export class Arcustangens extends Operation {

  public evaluate(dict: any): number {
    return Math.atan(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Arcustangens(this.operation.simplify());
  }
}
