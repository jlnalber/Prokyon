import {Func} from "./func";

export function newtonMethod(startValue: number, func: Func, dict: any, iterations: number): number {
  const derivation = func.derive();
  return internalNewtonMethod(startValue, func, derivation, dict, iterations);
}

function internalNewtonMethod(value: number, func: Func, derivation: Func, dict: any, iterations: number): number {
  const newValue = value - func.evaluate(value, dict) / derivation.evaluate(value, dict);
  return iterations === 1 ? newValue : internalNewtonMethod(newValue, func, derivation, dict, iterations - 1);
}
