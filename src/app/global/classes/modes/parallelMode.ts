import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import LineElement from "../canvas-elements/lineElement";
import {DrawerService} from "../../../services/drawer.service";
import {getTwoPointsFromABCFormLine} from "../../essentials/lineUtils";
import {Point} from "../../interfaces/point";
import {GREY} from "../../interfaces/color";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";

export default class ParallelMode extends TwoElementsSelectMode<PointElement, LineElement | LineSegmentElement> {
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

      const c = abcPLine.a * point.x + abcPLine.b * point.y;
      return getTwoPointsFromABCFormLine({
        a: abcPLine.a,
        b: abcPLine.b,
        c
      }) ?? [undefined, undefined]
    }, GREY))
  }
}
