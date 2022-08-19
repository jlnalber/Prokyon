import {Operation} from "../operation";
import {Subtraction} from "./subtraction";
import {Multiplication} from "./multiplication";
import {Pow} from "./pow";
import {Constant} from "../constants/constant";

export class Division extends Operation {
  public evaluate(dict: any): number {
    return this.dividend.evaluate(dict) / this.divisor.evaluate(dict);
  }

  public derive(): Operation {
    return new Division(new Subtraction(new Multiplication(this.dividend.derive(), this.divisor), new Multiplication(this.dividend, this.divisor.derive())),
                                      new Pow(this.divisor, new Constant(2)));
  }

  constructor(private readonly dividend: Operation, private readonly divisor: Operation) {
    super();
    this.childOperations.push(this.dividend, this.divisor);
  }

  public override toString(): string {
    return `(${this.dividend.toString()} / ${this.divisor.toString()})`;
  }

  public override simplify(): Operation {
    let newDividend = this.dividend.simplify();
    let newDivisor = this.divisor.simplify();

    if (newDivisor instanceof Constant && newDivisor.constant == 1) {
      return newDividend;
    }
    if (newDividend instanceof Constant && newDividend.constant == 0) {
      return new Constant(0);
    }

    return new Division(newDividend, newDivisor);
  }
}
