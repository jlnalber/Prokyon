import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import TwoPointsOrLineSegmentSelectMode from "./twoPointsOrLineSegmentSelectMode";

export default class BisectionMode extends TwoPointsOrLineSegmentSelectMode {

  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(LineElement.createBisectionByPoints(point1, point2))
  }

  protected override addCanvasElementFromLineSegment(drawerService: DrawerService, lineSegment: LineSegmentElement) {
    drawerService.addCanvasElements(LineElement.createBisectionByLineSegment(lineSegment))
  }
}
