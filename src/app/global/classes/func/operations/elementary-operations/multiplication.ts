import {Operation} from "../operation";
import {Addition} from "./addition";
import {Constant} from "../constants/constant";
import {hasWhereApplies} from "../../../../essentials/utils";
import {Division} from "./division";

export class Multiplication extends Operation {
  public evaluate(dict: any): number {
    let product = 1;
    for (let factor of this._factors) {
      product *= factor.evaluate(dict);
    }
    return product;
  }

  public derive(key: string): Operation {
    let summands: Operation[] = [];
    for (let i = 0; i < this._factors.length; i++) {
      let newFactors = this._factors.map((o, k) => {
        if (k == i) {
          return o.derive(key);
        }
        return o;
      });
      summands.push(new Multiplication(...newFactors));
    }
    return new Addition(...summands);
  }

  private readonly _factors: Operation[];
  public get factors(): Operation[] {
    return this._factors.slice();
  }

  constructor(...factors: Operation[]) {
    super();
    this._factors = factors;
    this.childOperations.push(...factors);
  }

  public override toString(): string {
    if (this._factors.length == 0) {
      return '1';
    }
    else {
      let str = `(${this._factors[0].toString()}`;
      for (let i = 1; i < this._factors.length; i++) {
        str += ` * ${this._factors[i].toString()}`;
      }
      str += ')';
      return str;
    }
  }

  public override simplify(): Operation {
    // simplify the factors, then filter out the constants und multiply them
    let factor = 1;
    let factors = this._factors.map(f => {
      return f.simplify();
    }).filter(f => {
      if (f instanceof  Constant) {
        factor *= f.constant;
        return false;
      }
      return true;
    });
    if (factor !== 1) {
      factors = [ new Constant(factor), ...factors ];
    }

    // if one factor is 0, then return 0
    if (hasWhereApplies(factors, f => {
      return (f instanceof Constant && f.constant == 0);
    })) {
      return new Constant(0);
    }

    // return if only one or no factor left
    if (factors.length === 0) {
      return new Constant(1);
    }
    else if (factors.length === 1) {
      return factors[0];
    }

    // check whether there are divisions as factors and write as fraction
    for (let i = 0; i < factors.length; i++) {
      const factor = factors[i];
      if (factor instanceof Division) {
        factors.splice(i, 1, factor.dividend);
        return new Division(new Multiplication(...factors), factor.divisor).simplify();
      }
    }

    // check whether there are other multiplications as factors and join them in one multiplication
    let newFactors = [];
    for (let factor of factors) {
      if (factor instanceof Multiplication) {
        newFactors.push(...factor._factors);
      }
      else {
        newFactors.push(factor);
      }
    }
    if (newFactors.length !== factors.length) {
      return new Multiplication(...newFactors).simplify();
    }

    // return new multiplication
    return new Multiplication(...factors);
  }
}
