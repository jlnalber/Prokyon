import {Operation} from "../operation";
import {Constant} from "../constants/constant";

export class Addition extends Operation {
  public evaluate(dict: any): number {
    let sum = 0;
    for (let summand of this.summands) {
      sum += summand.evaluate(dict);
    }
    return sum;
  }

  public derive(): Operation {
    return new Addition(...this.summands.map(s => {
      return s.derive();
    }))
  }

  private readonly summands: Operation[];

  constructor(...summands: Operation[]) {
    super();
    this.summands = summands;
    this.childOperations.push(...summands);
  }

  public override toString(): string {
    if (this.summands.length == 0) {
      return '0';
    }
    else {
      let str = `(${this.summands[0].toString()}`;
      for (let i = 1; i < this.summands.length; i++) {
        str += ` + ${this.summands[i].toString()}`;
      }
      str += ')';
      return str;
    }
  }

  public override simplify(): Operation {
    // simplify the summands, then filter out the constants and add them
    let sum = 0;
    let summands = this.summands.map(f => {
      return f.simplify();
    }).filter(f => {
      if (f instanceof  Constant) {
        sum += f.constant;
        return false;
      }
      return true;
    });
    if (sum != 0) {
      summands = [ new Constant(sum), ...summands ];
    }

    // return if only one or no summand left
    if (summands.length == 0) {
      return new Constant(0);
    }
    else if (summands.length == 1) {
      return summands[0];
    }

    // check whether there are other additions as summands and join them in one addition
    let newSummands = [];
    for (let summand of summands) {
      if (summand instanceof Addition) {
        newSummands.push(...summand.summands)
      }
      else {
        newSummands.push(summand);
      }
    }
    if (newSummands.length != summands.length) {
      return new Addition(...newSummands).simplify();
    }

    // return new addition
    return new Addition(...summands);
  }
}
