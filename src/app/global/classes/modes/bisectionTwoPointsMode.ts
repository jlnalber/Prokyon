import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import AbstractLine, {ABCFormLine} from "../canvas-elements/abstractLine";
import {GREY} from "../../interfaces/color";
import {
  getABCFormLineFromTwoPoints,
  getOrthogonalToLineThroughPoint,
  getTwoPointsFromABCFormLine
} from "../../essentials/lineUtils";

export default class BisectionTwoPointsMode extends TwoElementsSelectMode<PointElement, PointElement> {

  public constructor() {
    super([PointElement], [PointElement]);
  }

  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(new LineElement(() => {
      const abcAB = getABCFormLineFromTwoPoints(point1.point, point2.point);
      const p1 = point1.point;
      const p2 = point2.point;

      if (abcAB === undefined || p1 === undefined || p2 === undefined) {
        return [undefined, undefined];
      }
      const abc: ABCFormLine = getOrthogonalToLineThroughPoint(abcAB, {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
      });

      return getTwoPointsFromABCFormLine(abc) ?? [undefined, undefined];
    }, GREY))
  }
}
