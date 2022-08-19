import {Operation} from "../operation";
import {Division} from "../elementaryOperations/division";
import {Cosinus} from "./cosinus";
import {Pow} from "../elementaryOperations/pow";
import {Constant} from "../constants/constant";
import GeneralFunction from "../generalFunction";

export class Tangens extends GeneralFunction {

  public evaluate(dict: any): number {
    return Math.tan(this.operation.evaluate(dict));
  }

  public derive(): Operation {
    return new Division(this.operation.derive(), new Pow(new Cosinus(this.operation), new Constant(2)));
  }

  constructor(operation: Operation) {
    super(operation, 'tan');
  }
}
