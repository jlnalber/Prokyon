import {Operation} from "../operation";
import {Subtraction} from "./subtraction";
import {Multiplication} from "./multiplication";
import {Pow} from "./pow";
import {Constant} from "../constants/constant";
import {Variable} from "../variable";

export class Division extends Operation {
  public evaluate(dict: any): number {
    return this.dividend.evaluate(dict) / this.divisor.evaluate(dict);
  }

  public derive(key: string ): Operation {
    return new Division(new Subtraction(new Multiplication(this.dividend.derive(key), this.divisor), new Multiplication(this.dividend, this.divisor.derive(key))),
                                      new Pow(this.divisor, new Constant(2)));
  }

  constructor(public readonly dividend: Operation, public readonly divisor: Operation) {
    super();
    this.childOperations.push(this.dividend, this.divisor);
  }

  public override toString(): string {
    return `(${this.dividend.toString()} / ${this.divisor.toString()})`;
  }

  public override simplify(): Operation {
    // simplify the operations
    const newDividend = this.dividend.simplify();
    const newDivisor = this.divisor.simplify();

    // check for special values
    if (newDivisor instanceof Constant && newDivisor.constant == 1) {
      return newDividend;
    }
    if (newDividend instanceof Constant && newDividend.constant == 0) {
      return new Constant(0);
    }

    // if the dividend / divisor is a division, join the divisions
    if (newDividend instanceof Division) {
      return new Division(newDividend.dividend, new Multiplication(newDividend.divisor, newDivisor)).simplify();
    }
    if (newDivisor instanceof Division) {
      return new Division(new Multiplication(newDividend, newDivisor.divisor), newDivisor.dividend).simplify();
    }

    // trying to reduce variables (with a variable as divisor)
    if (newDivisor instanceof Variable && newDividend instanceof Multiplication) {
      const factors = newDividend.factors;
      for (let i = 0; i < factors.length; i++) {
        const factor = factors[i];

        // first case: a variable
        if (factor instanceof Variable && factor.key === newDivisor.key) {
          factors.splice(i, 1);
          return new Multiplication(...factors).simplify();
        }

        // second case: power
        else if (factor instanceof Pow && factor.base instanceof Variable && factor.base.key === newDivisor.key) {
          factors.splice(i, 1, new Pow(factor.base, new Subtraction(factor.exponent, new Constant(1))));
          return new Multiplication(...factors).simplify();
        }
      }
    }

    // trying to reduce variables (with a pow as divisor)
    if (newDivisor instanceof Pow && newDivisor.base instanceof Variable && newDividend instanceof Multiplication) {
      const factors = newDividend.factors;
      for (let i = 0; i < factors.length; i++) {
        const factor = factors[i];

        // first case: a variable
        if (factor instanceof Variable && factor.key === newDivisor.base.key) {
          factors.splice(i, 1, new Pow(newDivisor.base,
            new Subtraction(new Constant(1), newDivisor.exponent)));
          return new Multiplication(...factors).simplify();
        }

        // second case: power
        else if (factor instanceof Pow && factor.base instanceof Variable && factor.base.key === newDivisor.base.key) {
          factors.splice(i, 1, new Pow(factor.base,
            new Subtraction(factor.exponent, newDivisor.exponent)));
          return new Multiplication(...factors).simplify();
        }
      }
    }

    // return new division
    return new Division(newDividend, newDivisor);
  }
}
