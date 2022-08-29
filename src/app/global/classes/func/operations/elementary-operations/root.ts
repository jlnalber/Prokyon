import {Operation} from "../operation";
import {Constant} from "../constants/constant";
import {Pow} from "./pow";
import {Division} from "./division";

export class Root extends Operation {

  public evaluate(dict: any): number {
    return this.base.evaluate(dict) ** (1 / this.exponent.evaluate(dict));
  }

  public derive(key: string): Operation {
    return new Pow(this.base, new Division(new Constant(1), this.exponent)).derive(key);
  }

  constructor(private readonly base: Operation, private readonly exponent: Operation) {
    super();
    this.childOperations.push(this.base, this.exponent);
  }

  public override toString(): string {
    return `((${this.base.toString()}) ^ (1 / (${this.exponent.toString()})))`;
  }

  public override simplify(): Operation {
    let newBase = this.base.simplify();
    let newExponent = this.exponent.simplify();

    if (newExponent instanceof Constant && newExponent.constant == 1) {
      return newBase;
    }

    if (newBase instanceof Constant && newBase.constant == 1) {
      return new Constant(1);
    }

    return new Root(newBase, newExponent);
  }
}
