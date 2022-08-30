import {Func} from "../classes/func/func";

export function tryGetDerivative(func: Func): Func | undefined {
  try {
    return func.derive();
  } catch {
    return undefined;
  }
}

export function canDerive(func: Func): boolean {
  return tryGetDerivative(func) !== undefined;
}
