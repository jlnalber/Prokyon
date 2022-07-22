import {Rect} from "../interfaces/rect";
import {Point} from "../interfaces/point";

export function isIn(point: Point, rect: Rect): boolean {
  let firstP = rect as Point;
  let secondP: Point = {
    x:  firstP.x + rect.width,
    y: firstP.y + rect.height
  };
  return isInRange(point.x, firstP.x, secondP.x) && isInRange(point.y, firstP.y, secondP.y);
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

export function getPosFromPointerEvent(e: PointerEvent, el: Element): Point {
  const rect = el.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function getPosFromWheelEvent(e: WheelEvent, el: Element): Point {
  const rect = el.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
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

export function clamp(min: number, val: number, max: number): number {
  if (min > val) return min;
  if (max < val) return max;
  return val;
}
