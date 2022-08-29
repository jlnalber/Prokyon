import {Operation} from "../operation";
import GeneralFunction from "../other-operations/generalFunction";

export class Arcuscosinus extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.acos(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(operation: Operation) {
    super(operation, 'acos');
  }
}
