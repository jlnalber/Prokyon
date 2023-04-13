import TwoPointsOrLineSegmentSelectMode from "./twoPointsOrLineSegmentSelectMode";
import {DrawerService} from "../../../services/drawer.service";
import PointElement from "../canvas-elements/pointElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default class MiddlePointMode extends TwoPointsOrLineSegmentSelectMode {
  protected addCanvasElement(drawerService: DrawerService, e1: PointElement, e2: PointElement): void {
    drawerService.addCanvasElements(DynamicPointElement.createMiddlePointByPoints(e1, e2))
  }

  protected addCanvasElementFromLineSegment(drawerService: DrawerService, lineSegment: LineSegmentElement): void {
    drawerService.addCanvasElements(DynamicPointElement.createMiddlePointByLineSegment(lineSegment))
  }

}
