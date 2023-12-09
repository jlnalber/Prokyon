import {Operation} from "../operation";
import {Multiplication} from "../elementary-operations/multiplication";
import GeneralFunction from "../other-operations/generalFunction";
import {SinusHyperbolicus} from "./sinusHyperbolicus";

export class CosinusHyperbolicus extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.cosh(this.operation.evaluate(dict));
  }

  public derive(key: string): Operation {
    return new Multiplication(this.operation.derive(key), new SinusHyperbolicus(this.operation))
  }

  constructor(operation: Operation) {
    super(operation, 'cosh');
  }
}
