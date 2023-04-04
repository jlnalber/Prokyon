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
