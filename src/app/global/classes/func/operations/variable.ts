import {Operation} from "./operation";

export class Variable extends Operation {
  public evaluate(dict: any): number {
    let val = dict[this.key];
    if (typeof val == 'number') {
      return val;
    }
    throw 'no number found';
  }

  constructor(private readonly key: string) {
    super();
  }
}
