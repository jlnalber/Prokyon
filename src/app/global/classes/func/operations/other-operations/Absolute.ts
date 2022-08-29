import GeneralFunction from "./generalFunction";
import {Operation} from "../operation";

export class Absolute extends GeneralFunction {

  constructor(operation: Operation) {
    super(operation, 'abs');
  }

  derive(): Operation {
    throw 'not implemented yet';
  }

  evaluate(dict: any): number {
    return Math.abs(this.operation.evaluate(dict));
  }

}
