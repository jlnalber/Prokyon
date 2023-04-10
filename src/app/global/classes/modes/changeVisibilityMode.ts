import MoveMode from "./moveMode";
import {RenderingContext} from "../renderingContext";
import {DrawerService} from "../../../services/drawer.service";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {Color, colorAsTransparent} from "../../interfaces/color";

export default class ChangeVisibilityMode extends MoveMode {
  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = drawerService.getSelection(point, () => true, false);
    if (clickedElement !== undefined) {
      clickedElement.visible = !clickedElement.visible;
    }
  }

  override transformInvisibleColor = (c: Color) => colorAsTransparent(c);
}
