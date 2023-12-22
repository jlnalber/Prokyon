import GeneralFunction from "./other-operations/generalFunction";
import {Func} from "../func";
import {Operation} from "./operation";
import {clone} from "../../../essentials/utils";
import {Multiplication} from "./elementary-operations/multiplication";

export type FuncProvider = (key: string) => Func | undefined;

function deriveFunctionName(name: string): string {
  return name + "'";
}

export class ExternalFunction extends GeneralFunction {

  derive(key: string): Operation {
    return new Multiplication(this.operation.derive(key), new ExternalFunction(deriveFunctionName(this.funcKey), this.funcProvider, this.operation))
  }

  evaluate(dict: any): number {
    const func = this.func;
    if (func === undefined) {
      throw 'Func doesn\'t exist!';
    }
    return func.evaluate(this.operation.evaluate(dict), clone(dict))
  }

  constructor(public readonly funcKey: string, private readonly funcProvider: FuncProvider, operation: Operation) {
    super(operation, funcKey);
  }

  public get func(): Func | undefined {
    return this.funcProvider(this.funcKey);
  }
}
