import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import {GREY} from "../../interfaces/color";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default class LineSegmentsMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, PointElement | DynamicPointElement> {

  public constructor() {
    super([PointElement, DynamicPointElement], [PointElement, DynamicPointElement]);
  }

  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(new LineSegmentElement(() => [point1.point, point2.point], [point1, point2], () => {
      return {
        p1: point1.id,
        p2: point2.id
      }
    }, GREY, 'Verbindungsstrecke'))
  }
}
