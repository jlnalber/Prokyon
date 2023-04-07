import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {CanvasElement} from "../abstract/canvasElement";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default abstract class TwoPointsOrLineSegmentSelectMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, PointElement | DynamicPointElement> {
  public constructor() {
    super([PointElement, DynamicPointElement], [PointElement, DynamicPointElement]);
  }

  protected abstract addCanvasElementFromLineSegment(drawerService: DrawerService, lineSegment: LineSegmentElement): void;

  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void {
    const clickedElement = drawerService.getSelection(point, (c: CanvasElement) => c instanceof LineSegmentElement);
    if (clickedElement !== undefined) {
      this.addCanvasElementFromLineSegment(drawerService, clickedElement as LineSegmentElement);
    }
    else {
      super.click(drawerService, renderingContext, point, pointerContext);
    }
  }
}
