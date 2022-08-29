import {Operation} from "../operation";
import GeneralFunction from "../other-operations/generalFunction";

export class Arcuscosecans extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.asin(1 / this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(operation: Operation) {
    super(operation, 'acsc');
  }
}
