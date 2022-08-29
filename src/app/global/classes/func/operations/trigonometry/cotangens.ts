import {Operation} from "../operation";
import GeneralFunction from "../other-operations/generalFunction";

export class Cotangens extends GeneralFunction {

  public evaluate(dict: any): number {
    return 1 / Math.tan(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(operation: Operation) {
    super(operation, 'cot');
  }
}
