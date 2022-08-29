import {Operation} from "../operation";
import GeneralFunction from "../other-operations/generalFunction";

export class Arcussecans extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.acos(1 / this.operation.evaluate(dict));
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(operation: Operation) {
    super(operation, 'asec');
  }
}
