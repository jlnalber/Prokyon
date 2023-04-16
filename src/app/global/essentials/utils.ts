import {Rect} from "../interfaces/rect";
import {Point} from "../interfaces/point";
import {Color} from "../interfaces/color";

export function isIn(point: Point, rect: Rect, tolerance: number = 0): boolean {
  rect = correctRect(rect);
  const firstP = rect as Point;
  const secondP: Point = {
    x:  rect.x + rect.width,
    y: rect.y + rect.height
  };

  return isInRange(point.x, firstP.x - tolerance, secondP.x + tolerance) && isInRange(point.y, firstP.y - tolerance, secondP.y + tolerance);
}

export function isInRange(val: number, min: number, max: number): boolean {
  if (max < min) {
    return isInRange(val, max, min);
  }
  return val >= min && val <= max;
}

export function doRectsCollide(rect1: Rect, rect2: Rect): boolean {
  rect1 = correctRect(rect1);
  rect2 = correctRect(rect2);

  return !(rect1.x + rect1.width < rect2.x
        || rect2.x + rect2.width < rect1.x
        || rect1.y + rect1.height < rect2.y
        || rect2.y + rect2.height < rect1.y);
}

export function correctRect(rect: Rect): Rect {
  if (rect.width < 0) {
    return correctRect({
      x: rect.x + rect.width,
      y: rect.y,
      width: -rect.width,
      height: rect.height
    });
  } else if (rect.height < 0) {
    return correctRect({
      x: rect.x,
      y: rect.y + rect.height,
      width: rect.width,
      height: -rect.height
    })
  }
  return rect;
}

export function correctRectTo(rect: Rect, to: Rect): Rect | undefined {
  rect = correctRect(rect);
  to = correctRect(to);
  if (!doRectsCollide(rect, to)) {
    return undefined;
  }

  // Keep the values within the outer rect
  const xStart = Math.max(rect.x, to.x);
  const xEnd = Math.min(rect.x + rect.width, to.x + to.width);
  const yStart = Math.max(rect.y, to.y);
  const yEnd = Math.min(rect.y + rect.height, to.y + to.height);

  return {
    x: xStart,
    y: yStart,
    width: xEnd - xStart,
    height: yEnd - yStart
  };
}

export function getDistanceToRect(p: Point, rect: Rect): number {
  if (isIn(p, rect)) {
    return 0;
  }

  // Get the vertical and horizontal distance.
  const distX = Math.min(Math.abs(p.x - rect.x), Math.abs(p.x - rect.x - rect.width));
  const distY = Math.min(Math.abs(p.y - rect.y), Math.abs(p.y - rect.y - rect.height));

  if (isInRange(p.x, rect.x, rect.x + rect.width)) {
    return distY;
  } else if (isInRange(p.y, rect.y, rect.y + rect.height)) {
    return distX;
  } else {
    return Math.sqrt(distY ** 2 + distX ** 2);
  }
}

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function getDistanceUndef(p1: Point | undefined, p2: Point | undefined): number | undefined {
  if (p1 !== undefined && p2 !== undefined) {
    return getDistance(p1, p2);
  }
  return undefined;
}

export function getMinUndef(...vals: (number | undefined | null)[]): number | undefined | null {
  let min: number | undefined | null = undefined;
  for (let v of vals) {
    if (min === undefined || min === null || isNaN(min) || (v !== undefined && v !== null && !isNaN(v) && v < min)) {
      min = v;
    }
  }
  return min;
}

export function areEqualPoints(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function getPosFromEvent(e: PointerEvent | WheelEvent | MouseEvent, el: Element): Point {
  const rect = el.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function tryParseNumber(str: string): number | undefined {
  let retValue: number | undefined = undefined;
  if(str !== null) {
    // Replace the commas by points.
    while (str.indexOf(',') !== -1) {
      str = str.replace(',', '.');
    }

    if(str.length > 0) {
      if (isFinite(str as any)) {
        retValue = parseFloat(str);
      }
    }
  }
  return retValue;
}

export function isNumber(str: string): boolean {
  return tryParseNumber(str) !== undefined;
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

// this function searches the first occurrence of one of the searchValues in str
export function strIndexOf(str: string, ...searchValues: string[]): number {
  let pos = searchValues.map(s => {
    return str.indexOf(s);
  }).filter(n => {
    return n !== -1;
  });

  if (pos.length === 0) {
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
  return indexOfCombination(ts, func) !== -1;
}

export function strContains(str: string, ...searchValues: string[]): boolean {
  return strIndexOf(str, ...searchValues) !== -1;
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

export function mapElement<T>(element: T, mapArray: [T, T][]): T {
  for (let mapping of mapArray) {
    if (mapping[0] === element) {
      return mapping[1];
    }
  }
  return element;
}
