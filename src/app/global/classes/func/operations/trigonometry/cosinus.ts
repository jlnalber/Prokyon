import {Operation} from "../operation";
import {Multiplication} from "../elementaryOperations/multiplication";
import {Constant} from "../constants/constant";
import {Sinus} from "./sinus";
import GeneralFunction from "../generalFunction";

export class Cosinus extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.cos(this.operation.evaluate(dict));
  }

  public derive(key: string): Operation {
    return new Multiplication(new Constant(-1), this.operation.derive(key), new Sinus(this.operation))
  }

  constructor(operation: Operation) {
    super(operation, 'cos');
  }

  public override toString(): string {
    return `cos(${this.operation.toString()})`
  }
}
