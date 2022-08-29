import {Operation} from "../operation";

export class Constant extends Operation {
  public evaluate(): number {
    return this.constant;
  }

  public derive(): Operation {
    return new Constant(0);
  }

  constructor(public readonly constant: number) {
    super();
  }

  public override toString(): string {
    if (this.constant == Math.PI) {
      return 'pi';
    }
    else if (this.constant == Math.E) {
      return 'e';
    }
    else if (this.constant >= 0) {
      return this.constant.toString();
    }
    else {
      return `(${this.constant.toString()})`;
    }
  }
}
