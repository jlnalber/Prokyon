import {Operation} from "./operation";

export class Brackets extends Operation {
  public evaluate(dict: any): number {
    return this.operation.evaluate(dict);
  }

  constructor(private readonly operation: Operation) {
    super();
  }
}
