import {Point} from "../interfaces/point";

export function getDistanceToStraightLine(p: Point, linePoint1: Point, linePoint2: Point): number {
  // linePoint1 and linePoint2 define a straight line g whereas p is the point we want to calculate the distance to.

  // m is the steepness of g.
  const m = (linePoint1.y - linePoint2.y) / (linePoint1.x - linePoint2.x);

  // The following formula calculates the x-value of the intersection point of the orthogonal straight line to g.
  const intersectionX = (p.y + p.x / m - linePoint1.y + m * linePoint1.x) / (m + 1 / m);

  // Then, get the intersection point:
  const intersectionPoint: Point = {
    x: intersectionX,
    y: m * intersectionX + linePoint1.y - m * linePoint1.x
  }

  // Finally, return the distance:
  return Math.sqrt((p.x - intersectionPoint.x) ** 2 + (p.y - intersectionPoint.y) ** 2);
}
