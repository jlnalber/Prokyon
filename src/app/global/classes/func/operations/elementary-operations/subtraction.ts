import {Operation} from "../operation";
import {Constant} from "../constants/constant";
import {Multiplication} from "./multiplication";
import {Addition} from "./addition";

export class Subtraction extends Operation {
  public evaluate(dict: any): number {
    return this.minuend.evaluate(dict) - this.subtrahend.evaluate(dict);
  }

  public derive(key: string): Operation {
    return new Subtraction(this.minuend.derive(key), this.subtrahend.derive(key));
  }

  constructor(private readonly minuend: Operation, private readonly subtrahend: Operation) {
    super();
    this.childOperations.push(this.minuend, this.subtrahend);
  }

  public override toString(): string {
    return `(${this.minuend.toString()} - ${this.subtrahend.toString()})`;
  }

  public override simplify(): Operation {
    // simplify the "sub"-operations
    let newMinuend = this.minuend.simplify();
    let newSubtrahend = this.subtrahend.simplify();

    // trying to eliminate special cases or constants
    if (newSubtrahend instanceof Constant) {
      if (newSubtrahend.constant == 0) {
        return newMinuend;
      }
      if (newMinuend instanceof Constant) {
        return new Constant(newMinuend.constant - newSubtrahend.constant).simplify();
      }
    }
    if (newMinuend instanceof Constant && newMinuend.constant == 0) {
      return new Multiplication(new Constant(-1), newSubtrahend).simplify();
    }

    // if the minuend / subtrahend is an addition, simplify
    if (newMinuend instanceof Addition) {
      return new Addition(...newMinuend.summands, new Multiplication(new Constant(-1), newSubtrahend)).simplify();
    }
    else if (newSubtrahend instanceof Addition) {
      return new Addition(newMinuend, new Addition(...newSubtrahend.summands.map(s => {
        return new Multiplication(new Constant(-1), s);
      }))).simplify();
    }

    // returning a new subtraction
    return new Subtraction(newMinuend, newSubtrahend);
  }
}
