import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import PointElement from "../canvas-elements/pointElement";
import {CanvasElement} from "../abstract/canvasElement";

export default class MoveLabelsMode extends MoveMode {

  override pointerMove(drawerService: DrawerService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext) {
    if (drawerService.selection.size === 0) {
      super.pointerMove(drawerService, renderingContext, from, to, pointerContext);
    }
    else {
      for (let c of drawerService.selection.toArray()) {
        if (c.configuration.showLabel && c.configuration.label) {
          if (renderingContext.config?.drawNewLabels) {
            const zoom = renderingContext.zoom;
            const dx = (to.x - from.x) * zoom;
            const dy = (to.y - from.y) * zoom;
            c.labelTranslateX += dx;
            c.labelTranslateY += dy;
          }
          else {
            const range = renderingContext.range;
            const dx = (to.x - from.x) / Math.abs(range.width);
            const dy = (to.y - from.y) / Math.abs(range.height);
            c.labelTranslateX += dx;
            c.labelTranslateY += dy;
          }
        }
      }
    }
  }

  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    drawerService.setSelection(point, !pointerContext.ctrlKey)
  }
}
