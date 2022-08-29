import {Rect} from "../interfaces/rect";
import {Point} from "../interfaces/point";
import {Color} from "../interfaces/color";

export function isIn(point: Point, rect: Rect, tolerance: number = 0): boolean {
  let firstP = rect as Point;
  let secondP: Point = {
    x:  firstP.x + rect.width,
    y: firstP.y + rect.height
  };
  return isInRange(point.x - tolerance, firstP.x, secondP.x + tolerance) && isInRange(point.y - tolerance, firstP.y, secondP.y + tolerance);
}
export function expandRectBy(rect: Rect, factor: number): Rect {
  let addX = rect.width * factor;
  let addY = rect.height * factor;
  return {
    x: rect.x - addX,
    y: rect.y - addY,
    width: rect.width + 2 * addX,
    height: rect.height + 2 * addY
  };
}

export function isInRange(val: number, min: number, max: number): boolean {
  if (max < min) {
    return isInRange(val, max, min);
  }
  return val >= min && val <= max;
}

export function getPosFromEvent(e: PointerEvent | WheelEvent | MouseEvent, el: Element): Point {
  const rect = el.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function tryParseNumber(str: string): boolean {
  let retValue = null;
  if(str !== null) {
    if(str.length > 0) {
      if (!isNaN(str as any)) {
        retValue = parseInt(str);
      }
    }
  }
  return typeof retValue == 'number';
}

export function replaceAll(str: string, searchValue: string, replaceValue: string): string {
  let res = str;

  while (res.indexOf(searchValue) != -1) {
    res = res.replace(searchValue, replaceValue);
  }

  return res;
}

export function indexOf<T>(ts: T[], ...searchValues: T[]): number {
  for (let i = 0; i < ts.length; i++) {
    let c = ts[i];
    if (searchValues.indexOf(c) != -1) {
      return i;
    }
  }
  return -1;
}

export function strIndexOf(str: string, ...searchValues: string[]): number {
  let pos = searchValues.map(s => {
    return str.indexOf(s);
  }).filter(n => {
    return n != -1;
  });

  if (pos.length == 0) {
    return -1;
  }

  let minIndex = pos[0];
  for (let i = 1; i < pos.length; i++) {
    if (pos[i] < minIndex) {
      minIndex = pos[i];
    }
  }
  return minIndex;
}

export function lastIndexOf<T>(ts: T[], ...searchValues: T[]): number {
  for (let i = ts.length - 1; i >= 0; i--) {
    let c = ts[i];
    if (searchValues.indexOf(c) != -1) {
      return i;
    }
  }
  return -1;
}

export function contains<T>(ts: T[], ...searchValues: T[]): boolean {
  return indexOf(ts, ...searchValues) != -1;
}

export function indexOfCombination<T>(ts: T[], func: (t1: T, t2: T) => boolean): number {
  for (let i = 0; i < ts.length - 1; i++) {
    if (func(ts[i], ts[i + 1])) {
      return i;
    }
  }
  return -1;
}

export function lastIndexOfCombination<T>(ts: T[], func: (t1: T, t2: T) => boolean): number {
  for (let i = ts.length - 2; i >= 0; i--) {
    if (func(ts[i], ts[i + 1])) {
      return i;
    }
  }
  return -1;
}

export function containsCombination<T>(ts: T[], func: (t1: T, t2: T) => boolean): boolean {
  return indexOfCombination(ts, func) != -1;
}

export function strContains(str: string, ...searchValues: string[]): boolean {
  return strIndexOf(str, ...searchValues) != -1;
}

export function clamp(min: number, val: number, max: number): number {
  if (min > val) return min;
  if (max < val) return max;
  return val;
}

export function hasWhereApplies<T>(ts: T[], func: (t: T) => boolean): boolean {
  for (let t of ts) {
    if (func(t)) return true;
  }
  return false;
}

export function indexWhereApplies<T>(ts: T[], func: (t: T) => boolean): number{
  for (let i = 0; i < ts.length; i++) {
    if (func(ts[i])) return i;
  }
  return -1;
}

export function indexUntil<T>(arr: T[], addition: T[], subtraction: T[], startIndex?: number, errorMessage?: string, step: number = 1): number {
  let value = 0;
  for (let i = startIndex ?? 0; i >= 0 && i < arr.length; i += step) {
    let el = arr[i];
    if (contains(addition, el)) value++;
    if (contains(subtraction, el)) value--;

    if (value == 0) {
      return i;
    }
  }
  if (value == 0) {
    return startIndex ?? 0;
  }
  throw errorMessage;
}

export function sameColors(color1: Color, color2: Color): boolean {
  return (color1.r == color2.r) && (color1.g == color2.g) && (color1.b == color2.b)
        && (color1.a == color2.a || (!color1.a && !color2.a));
}

export function getNew<T>(pool: T[], arr: T[], compare: (t1: T, t2: T) => boolean): T {
  let newArr = arr.slice();
  let index = 0;
  let func = (t: T) => {
    return compare(pool[index % pool.length], t);
  };
  for (; hasWhereApplies(newArr, func); index++) {
    const indexInNewArr = indexWhereApplies(newArr, func);
    newArr.splice(indexInNewArr, 1);
  }
  return pool[index % pool.length];
}

export function clone(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

export function eliminateDuplicates<T>(ts: T[]): T[] {
  return [...(new Set<T>(ts))];
  /*let newT: T[] = [];
  for (let t of ts) {
    if (newT.indexOf(t) === -1) {
      newT.push(t);
    }
  }
  return newT;*/
}

export function joinAsSets<T>(...tArrs: T[][]): T[] {
  const set = new Set<T>();
  for (let tArr of tArrs) {
    for (let t of tArr) {
      set.add(t);
    }
  }
  return [ ...set ];
}
