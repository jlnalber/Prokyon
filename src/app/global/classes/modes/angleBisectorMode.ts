import {DrawerService} from "../../../services/drawer.service";
import PointElement from "../canvas-elements/pointElement";
import LineElement from "../canvas-elements/lineElement";
import ThreePointsSelectMode from "./threePointsSelectMode";

export default class AngleBisectorMode extends ThreePointsSelectMode {

  protected override addCanvasElement(drawerService: DrawerService, p1: PointElement, center: PointElement, p2: PointElement): void {
    drawerService.addCanvasElements(LineElement.createAngleBisector(center, p1, p2))
  }
}
