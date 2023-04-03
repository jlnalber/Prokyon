import MoveMode from "./moveMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {CanvasElement} from "../abstract/canvasElement";

export default abstract class TwoElementsSelectMode extends MoveMode {
  protected selectedPoint: PointElement | undefined;

  // should add the canvas element between two points
  protected abstract addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement): void;

  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    drawerService.selection.empty();

    // choose two points and add the element between them
    const clickedElement = drawerService.getSelection(point, (c: CanvasElement) => c instanceof PointElement) as PointElement | undefined;
    if (clickedElement !== undefined && clickedElement !== this.selectedPoint) {
      if (this.selectedPoint !== undefined) {
        this.addCanvasElement(drawerService, this.selectedPoint, clickedElement);
        this.selectedPoint = undefined;
      }
      else {
        this.selectedPoint = clickedElement;
        drawerService.selection.set(clickedElement);
      }
    }
    else {
      this.selectedPoint = undefined;
    }
  }
}
