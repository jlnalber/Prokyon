import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import AbstractLine, {ABCFormLine} from "../canvas-elements/abstractLine";
import {GREY} from "../../interfaces/color";
import {
  getABCFormLineFromTwoPoints, getBisectionByLineSegment, getBisectionByPoints,
  getOrthogonalToLineThroughPoint,
  getTwoPointsFromABCFormLine
} from "../../essentials/geometryUtils";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {CanvasElement} from "../abstract/canvasElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import TwoPointsOrLineSegmentSelectMode from "./twoPointsOrLineSegmentSelectMode";

export default class BisectionMode extends TwoPointsOrLineSegmentSelectMode {

  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(new LineElement(() => {
      return getBisectionByPoints(point1.point, point2.point);
    }, [point1, point2], GREY, 'Mittelsenkrechte'))
  }

  protected override addCanvasElementFromLineSegment(drawerService: DrawerService, lineSegment: LineSegmentElement) {
    drawerService.addCanvasElements(new LineElement(() => {
      return getBisectionByLineSegment(lineSegment);
    }, [lineSegment], GREY, 'Mittelsenkrechte'))
  }
}
