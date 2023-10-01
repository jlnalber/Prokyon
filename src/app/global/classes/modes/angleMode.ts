import {DrawerService} from "../../../services/drawer.service";
import PointElement from "../canvas-elements/pointElement";
import ThreePointsSelectMode from "./threePointsSelectMode";
import AngleElement from "../canvas-elements/angleElement";

export default class AngleMode extends ThreePointsSelectMode {

  protected override addCanvasElement(drawerService: DrawerService, p1: PointElement, center: PointElement, p2: PointElement): void {
    drawerService.addCanvasElements(new AngleElement([p1, center, p2], drawerService.getNewColor()));
  }
}
