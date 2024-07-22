import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import PointElement from "../canvas-elements/pointElement";

export default abstract class ThreePointsSelectMode extends MoveMode {
  protected abstract addCanvasElement(drawerService: DrawerService, p1: PointElement, center: PointElement, p2: PointElement): void;

  private clickedElement1: PointElement | undefined;
  private clickedElement2: PointElement | undefined;

  public override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = drawerService.getSelection(point, (c) => c instanceof PointElement) as PointElement | undefined;

    if (clickedElement !== undefined) {
      if (clickedElement === this.clickedElement1) {
        this.clickedElement1 = this.clickedElement2;
        this.clickedElement2 = undefined;
        drawerService.selection.remove(clickedElement);
        return;
      } else if (clickedElement === this.clickedElement2) {
        this.clickedElement2 = undefined;
        drawerService.selection.remove(clickedElement);
        return;
      }

      if ((this.clickedElement1 === undefined && this.clickedElement2 === undefined)
        || (this.clickedElement1 !== undefined && this.clickedElement2 !== undefined)) {
        drawerService.selection.empty();
      }

      if (this.clickedElement1 === undefined) {
        this.clickedElement1 = clickedElement;
        drawerService.selection.set(clickedElement);
        return;
      } else if (this.clickedElement2 === undefined) {
        this.clickedElement2 = clickedElement;
        drawerService.selection.alternate(clickedElement);
        return;
      } else {
        const center = this.clickedElement2;
        const p1 = this.clickedElement1;
        const p2 = clickedElement;
        this.clickedElement1 = undefined;
        this.clickedElement2 = undefined;
        this.addCanvasElement(drawerService, p1, center, p2);
      }
    } else {
      drawerService.selection.empty();
      this.clickedElement1 = undefined;
      this.clickedElement2 = undefined;
    }
  }
}
