import TwoPointSelectMode from "./twoPointSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import {GREY} from "../../interfaces/color";

export default class LineSegmentsMode extends TwoPointSelectMode {
  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(new LineSegmentElement(() => point1.point, () => point2.point, GREY))
  }
}
