import {Constant} from "./constant";

export class PiConstant extends Constant {
  constructor() {
    super(Math.PI);
  }

  public override toString(): string {
    return 'pi';
  }
}
