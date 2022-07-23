import {Operation} from "../operation";
import {Multiplication} from "../elementaryOperations/multiplication";
import {Constant} from "../constants/constant";
import {Sinus} from "./sinus";

export class Cosinus extends Operation {

  public evaluate(dict: any): number {
    return Math.cos(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    return new Multiplication(new Constant(-1), this.operation.derive(), new Sinus(this.operation))
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override toString(): string {
    return `cos(${this.operation.toString()})`
  }

  public override simplify(): Operation {
    return new Cosinus(this.operation.simplify());
  }
}
