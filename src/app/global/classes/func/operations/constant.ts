import {Operation} from "./operation";

export class Constant extends Operation {
  public evaluate(dict: any): number {
    return this.constant;
  }

  constructor(private readonly constant: number) {
    super();
  }
}
