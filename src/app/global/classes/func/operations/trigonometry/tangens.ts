import {Operation} from "../operation";
import {Division} from "../elementary-operations/division";
import {Cosinus} from "./cosinus";
import {Pow} from "../elementary-operations/pow";
import {Constant} from "../constants/constant";
import GeneralFunction from "../other-operations/generalFunction";

export class Tangens extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.tan(this.operation.evaluate(dict));
  }

  public derive(key: string): Operation {
    return new Division(this.operation.derive(key), new Pow(new Cosinus(this.operation), new Constant(2)));
  }

  constructor(operation: Operation) {
    super(operation, 'tan');
  }
}
