import {Operation} from "../operation";

export class Subtraction extends Operation {
  public evaluate(dict: any): number {
    return this.minuend.evaluate(dict) - this.subtrahend.evaluate(dict);
  }

  constructor(private readonly minuend: Operation, private readonly subtrahend: Operation) {
    super();
  }
}
