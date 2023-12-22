import {Func} from "./func";
import {Operation} from "./operations/operation";
import {Variable} from "./operations/variable";
import {ExternalFunction} from "./operations/externalFunction";
import {eliminateDuplicates} from "../../essentials/utils";

const derivativeCharacter = '\'';

export type InspectorResult = {
  variableNames: string[],
  externalFuncNames: string[]
}

export function inspect(func: Func): InspectorResult {
  return inspectOperation(func.operation);
}

export function inspectOperation(operation: Operation): InspectorResult {
  let variableNames: string[] = [];
  let externalFuncNames: string[] = [];

  if (operation instanceof Variable) {
    variableNames.push(operation.key);
  }
  if (operation instanceof ExternalFunction) {
    const name = operation.func?.name;
    if (name !== undefined) {
      externalFuncNames.push(name);
    }
  }

  operation.childOperations.forEach(child => {
    let res = inspectOperation(child);
    variableNames.push(...res.variableNames);
    externalFuncNames.push(...res.externalFuncNames);
  })

  variableNames = eliminateDuplicates(variableNames);
  externalFuncNames = eliminateDuplicates(externalFuncNames);

  return {
    variableNames,
    externalFuncNames
  }
}

export function isRecursive(func: Func, countDerivative: boolean = true): boolean {
  return containsFunc(func, func, countDerivative);
}

export function containsFunc(funcOrOp: Func | Operation, func: Func, countDerivative: boolean = false): boolean {
  if (funcOrOp instanceof Func) {
    return containsFunc(funcOrOp.operation, func);
  }
  else {
    if (funcOrOp instanceof ExternalFunction && (funcOrOp.funcKey === func.name ||
      (countDerivative && funcNameWithoutDerivative(funcOrOp.funcKey) === funcNameWithoutDerivative(func.name)))) {
      return true;
    }

    let res = false;
    funcOrOp.childOperations.forEach(item => {
      res = res || containsFunc(item, func);
    })
    if (funcOrOp instanceof ExternalFunction) {
      const f = funcOrOp.func;
      if (f !== undefined) {
        res = res || containsFunc(f, func);
      }
    }
    return res;
  }
}

export function containsVariable(funcOrOp: Func | Operation | undefined, varKey: string): boolean {
  if (funcOrOp === undefined) {
    return false;
  }
  else if (funcOrOp instanceof Func) {
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

export function funcNameWithoutDerivative(name: string | undefined): string | undefined {
  if (!name) return undefined;
  let res = name;
  while (res.endsWith(derivativeCharacter)) {
    res = res.substring(0, res.length - 1);
  }
  return res;
}

export function countDerivatives(funcName: string): number {
  let res = 0;
  let name = funcName;
  while (name.endsWith(derivativeCharacter)) {
    name = name.substring(0, name.length - 1);
    res++;
  }
  return res;
}
