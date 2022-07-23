import {Operation} from "../operation";
import {Multiplication} from "../elementaryOperations/multiplication";
import {Cosinus} from "./cosinus";

export class Sinus extends Operation {

  public evaluate(dict: any): number {
    return Math.sin(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    return new Multiplication(this.operation.derive(), new Cosinus(this.operation))
  }

  constructor(private readonly operation: Operation) {
    super();
  }

  public override toString(): string {
    return `sin(${this.operation.toString()})`
  }

  public override simplify(): Operation {
    return new Sinus(this.operation.simplify());
  }
}
