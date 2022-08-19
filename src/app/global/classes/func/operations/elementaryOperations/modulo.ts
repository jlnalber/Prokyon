import {Operation} from "../operation";

export class Modulo extends Operation {
  public evaluate(dict: any): number {
    return this.value.evaluate(dict) % this.modulo.evaluate(dict);
  }

  public derive(): Operation {
    throw 'not implemented yet';
  }

  constructor(private readonly value: Operation, private readonly modulo: Operation) {
    super();
    this.childOperations.push(this.value, this.modulo);
  }

  public override toString(): string {
    return `(${this.value.toString()} % ${this.modulo.toString()})`;
  }

  public override simplify(): Operation {
    return new Modulo(this.value.simplify(), this.modulo.simplify());
  }
}
