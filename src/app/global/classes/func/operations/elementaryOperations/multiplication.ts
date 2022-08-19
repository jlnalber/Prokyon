import {Operation} from "../operation";
import {Addition} from "./addition";
import {Constant} from "../constants/constant";
import {hasWhereApplies} from "../../../../essentials/utils";

export class Multiplication extends Operation {
  public evaluate(dict: any): number {
    let product = 1;
    for (let factor of this.factors) {
      product *= factor.evaluate(dict);
    }
    return product;
  }

  public derive(): Operation {
    let summands: Operation[] = [];
    for (let i = 0; i < this.factors.length; i++) {
      let newFactors = this.factors.map((o, k) => {
        if (k == i) {
          return o.derive();
        }
        return o;
      });
      summands.push(new Multiplication(...newFactors));
    }
    return new Addition(...summands);
  }

  private readonly factors: Operation[];

  constructor(...factors: Operation[]) {
    super();
    this.factors = factors;
    this.childOperations.push(...factors);
  }

  public override toString(): string {
    if (this.factors.length == 0) {
      return '1';
    }
    else {
      let str = `(${this.factors[0].toString()}`;
      for (let i = 1; i < this.factors.length; i++) {
        str += ` * ${this.factors[i].toString()}`;
      }
      str += ')';
      return str;
    }
  }

  public override simplify(): Operation {
    // simplify the factors, then filter out the constants und multiply them
    let factor = 1;
    let factors = this.factors.map(f => {
      return f.simplify();
    }).filter(f => {
      if (f instanceof  Constant) {
        factor *= f.constant;
        return false;
      }
      return true;
    });
    if (factor != 1) {
      factors = [ new Constant(factor), ...factors ];
    }

    // if one factor is 0, then return 0
    if (hasWhereApplies(factors, f => {
      return (f instanceof Constant && f.constant == 0);
    })) {
      return new Constant(0);
    }

    // return if only one or no factor left
    if (factors.length == 0) {
      return new Constant(1);
    }
    else if (factors.length == 1) {
      return factors[0];
    }

    // check whether there are other multiplications as factors and join them in one multiplication
    let newFactors = [];
    for (let factor of factors) {
      if (factor instanceof Multiplication) {
        newFactors.push(...factor.factors);
      }
      else {
        newFactors.push(factor);
      }
    }
    if (newFactors.length != factors.length) {
      return new Multiplication(...newFactors).simplify();
    }

    // return new multiplication
    return new Multiplication(...factors);
  }
}
