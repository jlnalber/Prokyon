import {Operation} from "../operation";

export class Addition extends Operation {
  public evaluate(dict: any): number {
    let sum = 0;
    for (let summand of this.summands) {
      sum += summand.evaluate(dict);
    }
    return sum;
  }

  private readonly summands: Operation[];

  constructor(...summands: Operation[]) {
    super();
    this.summands = summands;
  }
}
