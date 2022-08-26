import {Operation} from "./operation";
import {Constant} from "./constants/constant";

export class Variable extends Operation {
  public evaluate(dict: any): number {
    let val = dict[this.key];
    if (typeof val == 'number') {
      return val;
    }
    throw 'no number found';
  }

  public derive(key: string): Operation {
    return new Constant(key === this.key ? 1 : 0);
  }

  constructor(public readonly key: string) {
    super();
  }

  public override toString(): string {
    return this.key;
  }
}
