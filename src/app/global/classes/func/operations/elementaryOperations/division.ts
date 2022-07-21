import {Operation} from "../operation";

export class Division extends Operation {
  public evaluate(dict: any): number {
    return this.dividend.evaluate(dict) / this.divisor.evaluate(dict);
  }

  constructor(private readonly dividend: Operation, private readonly divisor: Operation) {
    super();
  }
}
