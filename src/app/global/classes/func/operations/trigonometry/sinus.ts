import {Operation} from "../operation";

export class Sinus extends Operation {

  public evaluate(dict: any): number {
    return Math.sin(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
