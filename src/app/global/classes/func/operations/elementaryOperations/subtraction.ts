import {Operation} from "../operation";
import {Constant} from "../constants/constant";
import {Multiplication} from "./multiplication";

export class Subtraction extends Operation {
  public evaluate(dict: any): number {
    return this.minuend.evaluate(dict) - this.subtrahend.evaluate(dict);
  }

  public derive(): Operation {
    return new Subtraction(this.minuend.derive(), this.subtrahend.derive());
  }

  constructor(private readonly minuend: Operation, private readonly subtrahend: Operation) {
    super();
  }

  public override toString(): string {
    return `(${this.minuend.toString()} - ${this.subtrahend.toString()})`;
  }

  public override simplify(): Operation {
    let newMinuend = this.minuend.simplify();
    let newSubtrahend = this.subtrahend.simplify();

    if (newSubtrahend instanceof Constant) {
      if (newSubtrahend.constant == 0) {
        return newMinuend;
      }
      if (newMinuend instanceof Constant) {
        return new Constant(newMinuend.constant - newSubtrahend.constant);
      }
    }
    if (newMinuend instanceof Constant && newMinuend.constant == 0) {
      return new Multiplication(new Constant(-1), newSubtrahend).simplify();
    }

    return new Subtraction(newMinuend, newSubtrahend);
  }
}
