import Register from "../../../essentials/register";
import {Func} from "../func";

export abstract class Operation {
  public readonly childOperations: Register<Operation> = new Register<Operation>();
  public abstract evaluate(dict: any): number;
  public abstract derive(): Operation;
  public simplify(): Operation {
    return this;
  }
}
