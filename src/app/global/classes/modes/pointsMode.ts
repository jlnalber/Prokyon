import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import PointElement from "../canvas-elements/pointElement";

export default class PointsMode extends MoveMode {
  override click(drawerService: DrawerService, rtx: RenderingContext, point: Point, context: PointerContext): void {
    drawerService.addCanvasElements(new PointElement(point, drawerService.getNewColor()));
  }
}
