import {Operation} from "../operation";
import {Multiplication} from "../elementary-operations/multiplication";
import GeneralFunction from "../other-operations/generalFunction";
import {CosinusHyperbolicus} from "./cosinusHyperbolicus";

export class SinusHyperbolicus extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.sinh(this.operation.evaluate(dict));
  }

  public derive(key: string): Operation {
    return new Multiplication(this.operation.derive(key), new CosinusHyperbolicus(this.operation))
  }

  constructor(operation: Operation) {
    super(operation, 'sinh');
  }
}
