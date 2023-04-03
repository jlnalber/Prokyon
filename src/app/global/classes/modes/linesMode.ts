import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import {GREY} from "../../interfaces/color";
import TwoElementsSelectMode from "./twoElementsSelectMode";

export default class LinesMode extends TwoElementsSelectMode {
  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(new LineElement(() => [point1.point, point2.point], GREY));
  }
}
