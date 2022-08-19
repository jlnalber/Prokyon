import GeneralFunction from "./generalFunction";
import {Func} from "../func";
import {Operation} from "./operation";
import {clone} from "../../../essentials/utils";
import {Multiplication} from "./elementaryOperations/multiplication";

export type FuncProvider = (key: string) => Func | undefined;

function deriveFunctionName(name: string): string {
  return name + "'";
}

export class ExternalFunction extends GeneralFunction {

  derive(): Operation {
    return new Multiplication(this.operation.derive(), new ExternalFunction(deriveFunctionName(this.funcKey), this.funcProvider, this.operation))
  }

  evaluate(dict: any): number {
    return this.func.evaluate(this.operation.evaluate(dict), clone(dict))
  }

  constructor(public readonly funcKey: string, private readonly funcProvider: FuncProvider, operation: Operation) {
    super(operation, funcKey);
  }

  public get func(): Func {
    let res = this.funcProvider(this.funcKey);
    if (!res) {
      throw 'Func doesn\'t exist!';
    }
    return res;
  }
}
