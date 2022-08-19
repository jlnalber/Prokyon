import {Operation} from "../operation";
import {Multiplication} from "../elementaryOperations/multiplication";
import {Cosinus} from "./cosinus";
import GeneralFunction from "../generalFunction";

export class Sinus extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.sin(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    return new Multiplication(this.operation.derive(), new Cosinus(this.operation))
  }

  constructor(operation: Operation) {
    super(operation, 'sin');
  }
}
