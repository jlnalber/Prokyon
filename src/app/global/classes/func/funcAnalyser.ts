import {Func} from "./func";
import {Point} from "../../interfaces/point";
import {tryGetDerivative} from "../../essentials/funcUtils";

export function newtonMethod(startValue: number, func: Func, dict: any, iterations: number): number {
  const derivative = func.derive();
  return internalNewtonMethod(startValue, func, derivative, dict, iterations);
}

function internalNewtonMethod(value: number, func: Func, derivative: Func, dict: any, iterations: number): number {
  const newValue = value - func.evaluate(value, dict) / derivative.evaluate(value, dict);
  return iterations === 1 ? newValue : internalNewtonMethod(newValue, func, derivative, dict, iterations - 1);
}

export function zerosInInterval(func: Func, dict: any, from: number, to: number, depth: number, respectChangeOfSign: boolean = false, checkWithDerivative: boolean = true, dontCheckLeft: boolean = false): number[] {
  // split the interval in many intervals
  // for each interval, check whether the outer values are already values>
  // if not, check whether they have different signs --> then the average is approximately considered as a zero
  // respectChangeOfSign indicates whether the sign has to change to count as a zero, this is especially useful for extrema
  // checkWithDerivative checks whether the function actually goes to the x-axis, that prevents zeros in functions like e.g. 1/x
  const average = (from + to) / 2;
  const centerDiff = (to - from) / 2;

  if (depth <= 0) {
    try {
      const zeros: number[] = [];
      const y1 = func.evaluate(from, dict);
      const y2 = func.evaluate(to, dict);

      // check for the outer values
      if (!dontCheckLeft && y1 === 0
        && (!respectChangeOfSign
          || func.evaluate(from - centerDiff, dict) * func.evaluate(from + centerDiff, dict) < 0)) {
        zeros.push(from);
      }
      if (y2 === 0
        && (!respectChangeOfSign
          || func.evaluate(to - centerDiff, dict) * func.evaluate(to + centerDiff, dict) < 0)) {
        zeros.push(to);
      }

      // check for the average
      if (y1 * y2 < 0 && isFinite(y1) && isFinite(y2)) {
        if (checkWithDerivative) {
          // try to check whether the function goes across the x-axis (and not do a jump like e.g. 1/x)
          const derivative = tryGetDerivative(func);
          if (!derivative
            || (y1 * derivative.evaluate(from, dict) <= 0)
              && y2 * derivative.evaluate(to, dict) >= 0) {
            zeros.push(average);
          }
        }
        else {
          zeros.push(average);
        }
      }

      // return the zeros
      return zeros;
    } catch {
      return [];
    }
  }

  return [ ...zerosInInterval(func, dict, from, average, depth - 1, respectChangeOfSign, checkWithDerivative, dontCheckLeft), ...zerosInInterval(func, dict, average, to, depth - 1, respectChangeOfSign, checkWithDerivative, true) ];
}

// kinda useless, huh? zero points should actually always have 0 as y-values
// but since it is an approximate approach, it should be more suitable like this...
export function zeroPointsInInterval(func: Func, dict: any, from: number, to: number, depth: number): Point[] {
  return zerosInInterval(func, dict, from, to, depth).map(x => {
    return {
      x,
      y: func.evaluate(x, dict)
    }
  })
}

export function extremaInInterval(func: Func, dict: any, from: number, to: number, depth: number): number[] {
  const derivative = func.derive();
  return zerosInInterval(derivative, dict, from, to, depth, true);
}

export function extremumPointsInInterval(func: Func, dict: any, from: number, to: number, depth: number): Point[] {
  return extremaInInterval(func, dict, from, to, depth).map(x => {
    return {
      x,
      y: func.evaluate(x, dict)
    }
  })
}

export function inflectionsInInterval(func: Func, dict: any, from: number, to: number, depth: number): number[] {
  const derivative = func.derive();
  return extremaInInterval(derivative, dict, from, to, depth);
}

export function inflectionPointsInInterval(func: Func, dict: any, from: number, to: number, depth: number): Point[] {
  return inflectionsInInterval(func, dict, from, to, depth).map(x => {
    return {
      x,
      y: func.evaluate(x, dict)
    };
  })
}
