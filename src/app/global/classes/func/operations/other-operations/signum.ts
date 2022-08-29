import GeneralFunction from "./generalFunction";
import {Operation} from "../operation";

export class Signum extends GeneralFunction {

  constructor(operation: Operation) {
    super(operation, 'sgn');
  }

  derive(): Operation {
    throw 'not implemented yet';
  }

  evaluate(dict: any): number {
    return Math.sign(this.operation.evaluate(dict));
  }

}
