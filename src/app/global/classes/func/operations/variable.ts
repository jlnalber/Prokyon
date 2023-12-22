import {Operation} from "./operation";
import {Constant} from "./constants/constant";

export const CHANGING_VARIABLE_KEY = '$VAR_';

export class Variable extends Operation {
  public evaluate(dict: any): number {
    let val = this.changingVariable === undefined ? dict[this.key] : dict[CHANGING_VARIABLE_KEY + this.changingVariable];
    if (typeof val == 'number') {
      return val;
    }
    throw 'no number found';
  }

  public derive(key: string): Operation {
    return new Constant(key === this.key ? 1 : 0);
  }

  constructor(public readonly key: string, public readonly changingVariable: number | undefined = undefined) {
    super();
  }

  public override toString(): string {
    return this.key;
  }
}
