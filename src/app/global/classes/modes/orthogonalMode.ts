import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import LineElement from "../canvas-elements/lineElement";
import {DrawerService} from "../../../services/drawer.service";
import {
  getIntersectionPointLines,
  getOrthogonalToLineThroughPoint,
  getTwoPointsFromABCFormLine
} from "../../essentials/lineUtils";
import {Point} from "../../interfaces/point";
import {GREY} from "../../interfaces/color";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import {isIn, isInRange} from "../../essentials/utils";

export default class OrthogonalMode extends TwoElementsSelectMode<PointElement, LineElement | LineSegmentElement> {
  constructor() {
    super([PointElement], [LineElement, LineSegmentElement]);
  }

  protected addCanvasElement(drawerService: DrawerService, e1: PointElement, e2: LineElement | LineSegmentElement): void {
    drawerService.addCanvasElements(new LineElement((): [undefined | Point, undefined | Point] => {
      const abcPLine = e2.getABCFormLine();
      const point = e1.point;
      if (abcPLine === undefined || point === undefined) {
        return [undefined, undefined]
      }
      const abcLine = getOrthogonalToLineThroughPoint(abcPLine, point);

      // check whether the point is actually in the line segment
      if (e2 instanceof LineSegmentElement) {
        const iPoint = getIntersectionPointLines(abcPLine, abcLine);
        const p1 = e2.point1;
        const p2 = e2.point2;
        if (iPoint === undefined || p1 === undefined || p2 === undefined) return [undefined, undefined];
        if (!(isInRange(iPoint.x, p1.x, p2.x) && isInRange(iPoint.y, p1.y, p2.y))) return [undefined, undefined];
      }

      return getTwoPointsFromABCFormLine(abcLine) ?? [undefined, undefined]
    }, GREY))
  }
}
