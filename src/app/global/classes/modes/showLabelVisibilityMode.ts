import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {RenderingContext} from "../renderingContext";

export default class ShowLabelVisibilityMode extends MoveMode {
  public override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = drawerService.getSelection(point);
    if (clickedElement !== undefined) {
      clickedElement.configuration.showLabel = clickedElement.configuration.showLabel !== true;
      drawerService.onCanvasElementChanged.emit(clickedElement);
    }
  }
}
