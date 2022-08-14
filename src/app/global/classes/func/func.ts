import {Operation} from "./operations/operation";

export class Func {
  constructor(private readonly operation: Operation, public readonly name?: string, private readonly variable?: string) { }

  public evaluate(x: number): number {
    let variable = this.variable ?? 'x';
    let dict: any = {};
    dict[variable] = x;
    return this.operation.evaluate(dict);
  }

  public derive(): Func {
    let name = undefined;
    if (this.name) {
      name = this.name + '\'';
    }
    return new Func(this.operation.derive(), name, this.variable);
  }

  public simplify(): Func {
    return new Func(this.operation.simplify(), this.name, this.variable);
  }

  public get operationAsString(): string {
    if (this.name) {
      return `${this.name}(${this.variable ?? 'x'}) = ${this.operation.toString()}`;
    }
    return this.operation.toString();
  }
}
