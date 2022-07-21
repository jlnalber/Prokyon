import {Operation} from "../operation";

export class Tangens extends Operation {

  public evaluate(dict: any): number {
    return Math.tan(this.operation.evaluate(dict));
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
