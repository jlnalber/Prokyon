import {Point} from "../interfaces/point";
import {ABCFormLine} from "../classes/canvas-elements/abstractLine";

export function getABCFormLineFromTwoPoints(point1: Point | undefined, point2: Point | undefined): ABCFormLine | undefined {
  if (point1 !== undefined && point2 !== undefined) {
    const a = point2.y - point1.y;
    const b = point1.x - point2.x;

    return {
      a,
      b,
      c: a * point1.x + b * point1.y
    }
  }

  return undefined;
}

export function getTwoPointsFromABCFormLine(abc: ABCFormLine | undefined): [Point, Point] | undefined {
  if (abc === undefined || (abc.a === 0 && abc.b === 0)) {
    return undefined;
  }
  else if (abc.a === 0) {
    return [{
      x: 0,
      y: abc.c / abc.b
    }, {
      x: 1,
      y: abc.c / abc.b
    }]
  }
  else {
    return [{
      x: abc.c / abc.a,
      y: 0
    }, {
      x: (abc.c - abc.b) / abc.a,
      y: 1
    }]
  }
}

export function getOrthogonalToLineThroughPoint(abcFormLine: ABCFormLine, point: Point): ABCFormLine {
  const a = abcFormLine.b;
  const b = -abcFormLine.a
  return {
    a,
    b,
    c: a * point.x + b * point.y
  }
}

export function getIntersectionPointLines(abc1: ABCFormLine, abc2: ABCFormLine): Point | undefined {
  const p = abc1.b * abc2.a - abc1.a * abc2.b;
  const d = abc1.c * abc2.a - abc1.a * abc2.c;

  if (p === 0) {
    // in this case, the two lines are parallel
    return undefined;
  }

  const y = d / p;

  return {
    y,
    x: abc1.a !== 0 ? (abc1.c - abc1.b * y) / abc1.a : (abc2.c - abc2.b * y) / abc2.a
  }
}

export function getIntersectionPointLineAndCircle(abc: ABCFormLine, center: Point, radius: number): [Point | undefined, Point | undefined] {
  // ensure that abc.a is unequal to 0
  if (abc.a === 0) {
    if (abc.b === 0) {
      return [undefined, undefined]
    }

    const newABC = {
      a: abc.b,
      b: abc.a,
      c: abc.c
    }
    const newCenter = {
      x: center.y,
      y: center.x
    }

    const res = getIntersectionPointLineAndCircle(newABC, newCenter, radius);

    return [res[0] === undefined ? undefined : {
      x: res[0]!.y,
      y: res[0]!.x
    }, res[1] === undefined ? undefined : {
      x: res[1]!.y,
      y: res[1]!.x
    }
    ]
  }

  const a = (abc.b / abc.a) ** 2 + 1;
  const b = - 2 * abc.c * abc.b / (abc.a ** 2) - 2 * center.y + 2 * abc.b * center.x / abc.a;
  const c = (abc.c ** 2) / (abc.a ** 2) + center.x ** 2 + center.y ** 2 - radius ** 2 - 2 * abc.c * center.x / abc.a;

  const disc = b ** 2 - 4 * a * c;
  if (disc < 0) {
    return [undefined, undefined];
  }
  else if (disc === 0) {
    const y = -b / (2 * a)
    return [{
      x: (abc.c - abc.b * y) / abc.a,
      y
    }, undefined];
  }
  else {
    const y1 = (-b - Math.sqrt(disc)) / (2 * a);
    const y2 = (-b + Math.sqrt(disc)) / (2 * a);
    return [{
      x: (abc.c - abc.b * y1) / abc.a,
      y: y1
    }, {
      x: (abc.c - abc.b * y2) / abc.a,
      y: y2
    }]
  }
}

export function getIntersectionPointCircles(center1: Point, radius1: number, center2: Point, radius2: number): [Point | undefined, Point | undefined] {

  const getPs = (y: number): [Point | undefined, Point | undefined] => {
    const disc = radius1 ** 2 - y ** 2;
    if (disc < 0) return [undefined, undefined];
    if (disc === 0) {
      return [{
        x: 0,
        y
      }, undefined]
    }

    return [{
      x: Math.sqrt(disc),
      y
    }, {
      x: -Math.sqrt(disc),
      y
    }]
  }

  const score = (p: Point | undefined): number => {
    if (p === undefined) return Number.MAX_VALUE;

    return Math.abs((p.x - center2.x) ** 2 + (p.y - center2.y) ** 2 - radius2 * radius2);
  }

  if (center1.x !== 0 || center1.y !== 0) {
    const res = getIntersectionPointCircles({
      x: 0,
      y: 0
    }, radius1, {
      x: center2.x - center1.x,
      y: center2.y - center1.y
    }, radius2);

    return res.map(i => {
      if (i === undefined) {
        return undefined;
      }
      else {
        return {
          x: i.x + center1.x,
          y: i.y + center1.y
        }
      }
    }) as [Point | undefined, Point | undefined];
  }

  const a = center2.x;
  const b = center2.y;
  const d = radius2 * radius2 - radius1 * radius1 - a * a - b * b;
  const am = 4 * (a * a) + 4 * (b * b);
  const bm = 4 * d * b;
  const cm = - 4 * (a * a) * (radius1 * radius1) + d * d;

  const disc = bm ** 2 - 4 * am * cm;

  if (am === 0 || disc < 0) {
    return [undefined, undefined];
  }
  else if (disc === 0) {
    const arr = getPs(-bm / (2 * am));
    const arrSorted = arr.sort((p1, p2) => score(p1) - score(p2));
    return [arrSorted[0], /*arrSorted[1]*/ undefined];
  }

  const arr: (Point | undefined)[] = [...getPs((-bm + Math.sqrt(disc)) / (2 * am)), ...getPs((-bm - Math.sqrt(disc)) / (2 * am))];

  const arrSorted = arr.sort((p1, p2) => score(p1) - score(p2));
  return [arrSorted[0], arrSorted[1]];
  //arr.push(...getPs((-bm - Math.sqrt(disc)) / (2 * am)));

  /*const res = arr.filter(i => i !== undefined);
  while (res.length < 2) {
    res.push(undefined);
  }
  return res as [Point | undefined, Point | undefined];*/
}
