import TwoElementsSelectMode, {Constructor} from "./twoElementsSelectMode";
import LineElement from "../canvas-elements/lineElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import CircleElement from "../canvas-elements/circleElement";
import {DrawerService} from "../../../services/drawer.service";
import AbstractLine from "../canvas-elements/abstractLine";
import {
  getIntersectionPointCircles,
  getIntersectionPointLineAndCircle,
  getIntersectionPointLines
} from "../../essentials/lineUtils";
import {isInRange} from "../../essentials/utils";
import {GREY} from "../../interfaces/color";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import {Point} from "../../interfaces/point";

type Elements = LineElement | LineSegmentElement | CircleElement;

export default class IntersectionMode extends TwoElementsSelectMode<Elements, Elements> {
  constructor() {
    super([LineElement, LineSegmentElement, CircleElement] as Constructor<Elements>[], [LineElement, LineSegmentElement, CircleElement] as Constructor<Elements>[]);
  }

  protected addCanvasElement(drawerService: DrawerService, e1: Elements, e2: Elements): void {
    // case: line and line
    if (e1 instanceof AbstractLine && e2 instanceof AbstractLine) {
      drawerService.addCanvasElements(new DynamicPointElement(() => {
        const abcLine1 = (e1 as AbstractLine).getABCFormLine();
        const abcLine2 = (e2 as AbstractLine).getABCFormLine();
        if (abcLine1 === undefined || abcLine2 === undefined) {
          return undefined;
        }

        const iPoint = getIntersectionPointLines(abcLine1, abcLine2);

        if (iPoint === undefined) return undefined;

        // check whether the point is actually in the line segment
        if (e1 instanceof LineSegmentElement) {
          const p1 = e1.point1;
          const p2 = e1.point2;
          if (p1 === undefined || p2 === undefined) return undefined;
          if (!(isInRange(iPoint.x, p1.x, p2.x) && isInRange(iPoint.y, p1.y, p2.y))) return undefined;
        }
        if (e2 instanceof LineSegmentElement) {
          const p1 = e2.point1;
          const p2 = e2.point2;
          if (p1 === undefined || p2 === undefined) return undefined;
          if (!(isInRange(iPoint.x, p1.x, p2.x) && isInRange(iPoint.y, p1.y, p2.y))) return undefined;
        }

        return iPoint
      }, GREY))
      return;
    }

    // switch circle and line
    if (e1 instanceof CircleElement && e2 instanceof AbstractLine) {
      const temp = e1;
      e1 = e2;
      e2 = temp;
    }
    // case: line and a circle
    if (e1 instanceof AbstractLine && e2 instanceof CircleElement) {
      const provider = (i: 0 | 1) => () => {
        const abc = (e1 as AbstractLine).getABCFormLine();
        const center = (e2 as CircleElement).point;
        const radius = (e2 as CircleElement).radius;
        if (abc === undefined || center === undefined || radius === undefined) {
          return undefined
        }
        const iPoint = getIntersectionPointLineAndCircle(abc, center, radius)[i];
        if (iPoint === undefined) return undefined;

        if (e1 instanceof LineSegmentElement) {
          const point1 = e1.point1;
          const point2 = e1.point2;
          if (point1 === undefined || point2 === undefined) return undefined;

          return (isInRange(iPoint.x, point1.x, point2.x) && isInRange(iPoint.y, point1.y, point2.y)) ? iPoint : undefined;
        }
        else {
          return iPoint;
        }
      }

      drawerService.addCanvasElements(new DynamicPointElement(provider(0), GREY));
      drawerService.addCanvasElements(new DynamicPointElement(provider(1), GREY));

      return;
    }

    // case: circle and circle
    if (e1 instanceof CircleElement && e2 instanceof CircleElement) {
      const provider = (i: number) => (): undefined | Point => {
        const center1 = (e1 as CircleElement).point;
        const radius1 = (e1 as CircleElement).radius;
        const center2 = (e2 as CircleElement).point;
        const radius2 = (e2 as CircleElement).radius;

        if (center1 === undefined || radius1 === undefined || center2 === undefined || radius2 === undefined) {
          return undefined;
        }

        return getIntersectionPointCircles(center1, radius1, center2, radius2)[i];
      }

      drawerService.addCanvasElements(new DynamicPointElement(provider(0), GREY));
      drawerService.addCanvasElements(new DynamicPointElement(provider(1), GREY));
      //drawerService.addCanvasElements(new DynamicPointElement(provider(2), GREY));
      //drawerService.addCanvasElements(new DynamicPointElement(provider(3), GREY));

      return;
    }
  }
}
