import Register from "../../../essentials/register";

export abstract class Operation {
  public readonly childOperations: Register<Operation> = new Register<Operation>();
  public abstract evaluate(dict: any): number;
  public abstract derive(key: string): Operation;
  public simplify(): Operation {
    return this;
  }
}
