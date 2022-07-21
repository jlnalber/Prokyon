import {Operation} from "../operation";

export class Multiplication extends Operation {
  public evaluate(dict: any): number {
    let product = 1;
    for (let factor of this.factors) {
      product *= factor.evaluate(dict);
    }
    return product;
  }

  private readonly factors: Operation[];

  constructor(...factors: Operation[]) {
    super();
    this.factors = factors;
  }
}
