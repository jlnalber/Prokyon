import {Operation} from "../operation";

export class Arcuscotangens extends Operation {

  public evaluate(dict: any): number {
    return Math.PI / 2 - Math.atan(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override simplify(): Operation {
    return new Arcuscotangens(this.operation.simplify());
  }
}
