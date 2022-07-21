import {Operation} from "../operation";

export class Pow extends Operation {

  public evaluate(dict: any): number {
    return this.base.evaluate(dict) ** this.exponent.evaluate(dict);
  }

  constructor(private readonly base: Operation, private readonly exponent: Operation) {
    super();
  }
}
