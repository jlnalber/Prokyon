import {Operation} from "../operation";

export default abstract class GeneralFunction extends Operation {

  protected constructor(operation: Operation, private readonly str: string) {
    super();
    this.operation = operation;
  }

  public get operation(): Operation {
    return this.childOperations.getItem(0);
  }

  public set operation(value: Operation) {
    this.childOperations.setItem(0, value);
  }

  public override simplify(): Operation {
    this.operation = this.operation.simplify();
    return this;
  }

  public override toString(): string {
    return `${this.str}(${this.operation.toString()})`;
  }
}
