import {Operation} from "./operation";
import {Division} from "./elementaryOperations/division";
import {Constant} from "./constants/constant";

export class NaturalLogarithm extends Operation {

  public evaluate(dict: any): number {
    return Math.log(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    return new Division(this.operation.derive(), this.operation);
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override toString(): string {
    return `ln (${this.operation.toString()})`;
  }

  public override simplify(): Operation {
    let newOperation = this.operation.simplify();
    if (newOperation instanceof Constant) {
      if (newOperation.constant == 1) {
        return new Constant(0);
      }
      else if (newOperation.constant == Math.E) {
        return new Constant(1);
      }
    }

    return new NaturalLogarithm(newOperation);
  }
}
