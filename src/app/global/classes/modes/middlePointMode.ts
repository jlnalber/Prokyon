import TwoPointsOrLineSegmentSelectMode from "./twoPointsOrLineSegmentSelectMode";
import {DrawerService} from "../../../services/drawer.service";
import PointElement from "../canvas-elements/pointElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import {getMiddlePointByPoints, getMiddlePointsByLineSegment} from "../../essentials/geometryUtils";
import {GREY} from "../../interfaces/color";

export default class MiddlePointMode extends TwoPointsOrLineSegmentSelectMode {
  protected addCanvasElement(drawerService: DrawerService, e1: PointElement, e2: PointElement): void {
    drawerService.addCanvasElements(new DynamicPointElement(() => {
      return getMiddlePointByPoints(e1.point, e2.point);
    }, [e1, e2], GREY))
  }

  protected addCanvasElementFromLineSegment(drawerService: DrawerService, lineSegment: LineSegmentElement): void {
    drawerService.addCanvasElements(new DynamicPointElement(() => {
      return getMiddlePointsByLineSegment(lineSegment);
    }, [lineSegment], GREY))
  }

}
