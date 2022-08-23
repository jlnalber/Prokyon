import {Operation} from "./operations/operation";

export class Func {
  constructor(public readonly operation: Operation, public readonly name?: string, public readonly variable?: string) { }

  public evaluate(x: number, dict?: any): number {
    if (this.stopEvaluation) {
      throw 'evaluation stopped'
    }
    let variable = this.variable ?? 'x';
    dict = dict ?? {};
    dict[variable] = x;
    return this.operation.evaluate(dict);
  }

  public derive(): Func {
    let name = undefined;
    if (this.name) {
      name = this.name + '\'';
    }
    return new Func(this.operation.derive(), name, this.variable).simplify();
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

  public stopEvaluation: boolean = false;
}
