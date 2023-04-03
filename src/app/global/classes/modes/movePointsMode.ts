import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {CanvasElement} from "../abstract/canvasElement";
import PointElement from "../canvas-elements/pointElement";

export default class MovePointsMode extends MoveMode {

  override pointerMove(drawerService: DrawerService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext) {
    if (drawerService.selection.size === 0) {
      super.pointerMove(drawerService, renderingContext, from, to, pointerContext);
    }
    else {
      for (let c of drawerService.selection.toArray()) {
        if (c instanceof PointElement && c.x !== undefined && c.y !== undefined && !c.dependent) {
          c.x += to.x - from.x;
          c.y += to.y - from.y;
        }
      }
    }
  }

  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    drawerService.setSelection(point, !pointerContext.ctrlKey, (c: CanvasElement) => {
      return c instanceof PointElement && !c.dependent;
    })
  }
}
