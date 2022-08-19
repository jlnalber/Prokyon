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

  public derive(): Operation {
    return new Constant(1);
  }

  constructor(public readonly key: string) {
    super();
  }

  public override toString(): string {
    return this.key;
  }
}
