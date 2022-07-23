import {Constant} from "./constant";

export class EConstant extends Constant {
  constructor() {
    super(Math.E);
  }

  public override toString(): string {
    return 'e';
  }
}
