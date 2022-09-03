import {Func} from "../classes/func/func";
import {isRecursive} from "../classes/func/funcInspector";

export function tryGetDerivative(func: Func): Func | undefined {
  try {
    const derivative = func.derive();

    // Check for derivation of External Functions as well.
    isRecursive(derivative);

    return derivative;
  } catch {
    return undefined;
  }
}
