import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import LineElement from "../canvas-elements/lineElement";
import {DrawerService} from "../../../services/drawer.service";
import {getParallelToLineThroughPoint} from "../../essentials/geometryUtils";
import {Point} from "../../interfaces/point";
import {GREY} from "../../interfaces/color";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default class ParallelMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, LineElement | LineSegmentElement> {
  constructor() {
    super([PointElement, DynamicPointElement], [LineElement, LineSegmentElement]);
  }

  protected addCanvasElement(drawerService: DrawerService, e1: PointElement, e2: LineElement | LineSegmentElement): void {
    drawerService.addCanvasElements(new LineElement((): [undefined | Point, undefined | Point] => {
      const abcPLine = e2.getABCFormLine();
      const point = e1.point;
      return getParallelToLineThroughPoint(abcPLine, point);
    }, [e1, e2], GREY, 'Parallele'))
  }
}
