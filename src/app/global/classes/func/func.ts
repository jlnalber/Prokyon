import {Operation} from "./operations/operation";
import {CHANGING_VARIABLE_KEY} from "./operations/variable";

export class Func {
  constructor(public readonly operation: Operation, public readonly name?: string, public readonly variable: string = 'x') { }

  public evaluate(x: number, dict?: any): number {
    if (this.stopEvaluation) {
      throw 'evaluation stopped'
    }
    dict = dict ?? {};
    dict[CHANGING_VARIABLE_KEY + 0] = x;
    return this.operation.evaluate(dict);
  }

  public derive(): Func {
    let name = undefined;
    if (this.name) {
      name = this.name + '\'';
    }
    return new Func(this.operation.derive(this.variable), name, this.variable).simplify();
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
