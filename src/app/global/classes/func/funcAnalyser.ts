import {Func} from "./func";
import {Operation} from "./operations/operation";
import {Variable} from "./operations/variable";
import {ExternalFunction} from "./operations/externalFunction";

const derivationCharacter = '\'';

type AnalyserResult = {
  variableNames: string[],
  externalFuncNames: string[]
}

export function analyse(func: Func): AnalyserResult {
  return analyseOperation(func.operation);
}

export function analyseOperation(operation: Operation): AnalyserResult {
  let variableNames: string[] = [];
  let externalFuncNames: string[] = [];

  if (operation instanceof Variable) {
    variableNames.push(operation.key);
  }
  if (operation instanceof ExternalFunction) {
    externalFuncNames.push(operation.func.name!);
  }

  operation.childOperations.forEach(child => {
    let res = analyseOperation(child);
    variableNames.push(...res.variableNames);
    externalFuncNames.push(...res.externalFuncNames);
  })

  return {
    variableNames,
    externalFuncNames
  }
}

export function isRecursive(func: Func, countDerivation: boolean = true): boolean {
  return containsFunc(func, func, countDerivation);
}

export function containsFunc(funcOrOp: Func | Operation, func: Func, countDerivation: boolean = false): boolean {
  if (funcOrOp instanceof Func) {
    return containsFunc(funcOrOp.operation, func);
  }
  else {
    if (funcOrOp instanceof ExternalFunction && (funcOrOp.funcKey === func.name ||
      (countDerivation && funcNameWithoutDerivation(funcOrOp.funcKey) === funcNameWithoutDerivation(func.name)))) {
      return true;
    }

    let res = false;
    funcOrOp.childOperations.forEach(item => {
      res = res || containsFunc(item, func);
    })
    if (funcOrOp instanceof ExternalFunction) {
      res = res || containsFunc(funcOrOp.func, func);
    }
    return res;
  }
}

export function containsVariable(funcOrOp: Func | Operation, varKey: string): boolean {
  if (funcOrOp instanceof Func) {
    return containsVariable(funcOrOp.operation, varKey);
  }
  else {
    if (funcOrOp instanceof Variable && funcOrOp.key === varKey) {
      return true;
    }

    let res = false;
    funcOrOp.childOperations.forEach(item => {
      res = res || containsVariable(item, varKey);
    })
    if (funcOrOp instanceof ExternalFunction) {
      res = res || containsVariable(funcOrOp.func, varKey);
    }
    return res;
  }
}

export function funcNameWithoutDerivation(name: string | undefined): string | undefined {
  if (!name) return undefined;
  let res = name;
  while (res.endsWith(derivationCharacter)) {
    res = res.substring(0, res.length - 1);
  }
  return res;
}

export function countDerivations(funcName: string): number {
  let res = 0;
  let name = funcName;
  while (name.endsWith(derivationCharacter)) {
    name = name.substring(0, name.length - 1);
    res++;
  }
  return res;
}
