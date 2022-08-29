import {Operation} from "../operation";
import {Multiplication} from "../elementary-operations/multiplication";
import {Cosinus} from "./cosinus";
import GeneralFunction from "../other-operations/generalFunction";

export class Sinus extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.sin(this.operation.evaluate(dict));
  }

  public derive(key: string): Operation {
    return new Multiplication(this.operation.derive(key), new Cosinus(this.operation))
  }

  constructor(operation: Operation) {
    super(operation, 'sin');
  }
}
