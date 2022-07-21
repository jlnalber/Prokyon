import {Operation} from "../operation";

export class Root extends Operation {

  public evaluate(dict: any): number {
    return this.base.evaluate(dict) ** (1 / this.exponent.evaluate(dict));
  }

  constructor(private readonly base: Operation, private readonly exponent: Operation) {
    super();
  }
}
