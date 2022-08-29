import {Operation} from "../operation";
import GeneralFunction from "../other-operations/generalFunction";

export class Arcuscotangens extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.PI / 2 - Math.atan(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(operation: Operation) {
    super(operation, 'acot');
  }
}
