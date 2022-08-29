import {Operation} from "../operation";
import {Constant} from "../constants/constant";
import {Multiplication} from "./multiplication";
import {Addition} from "./addition";
import {NaturalLogarithm} from "../other-operations/naturalLogarithm";
import {Division} from "./division";

export class Pow extends Operation {

  public evaluate(dict: any): number {
    return this.base.evaluate(dict) ** this.exponent.evaluate(dict);
  }

  public derive(key: string): Operation {
    return new Multiplication(new Pow(this.base, this.exponent),
                              new Addition(new Multiplication(this.exponent.derive(key), new NaturalLogarithm(this.base)),
                                            new Multiplication(this.exponent, new Division(this.base.derive(key), this.base))));
  }

  constructor(public readonly base: Operation, public readonly exponent: Operation) {
    super();
    this.childOperations.push(this.base, this.exponent);
  }

  public override toString(): string {
    return `((${this.base.toString()}) ^ (${this.exponent.toString()}))`;
  }

  public override simplify(): Operation {
    let newBase = this.base.simplify();
    let newExponent = this.exponent.simplify();

    // check for the exponent
    if (newExponent instanceof Constant) {
      if (newExponent.constant == 1) {
        return newBase;
      }
      else if (newExponent.constant == 0) {
        return new Constant(1);
      }
    }

    // check the base
    if (newBase instanceof Constant && newBase.constant == 1) {
      return new Constant(1);
    }

    // simplify if there are two pows (in the base as well)
    if (newBase instanceof Pow) {
      return new Pow(newBase.base, new Multiplication(newBase.exponent, newExponent)).simplify();
    }

    return new Pow(newBase, newExponent);
  }
}
