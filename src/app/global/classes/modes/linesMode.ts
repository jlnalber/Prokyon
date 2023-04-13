import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import TwoElementsSelectMode from "./twoElementsSelectMode";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default class LinesMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, PointElement | DynamicPointElement> {

  public constructor() {
    super([PointElement, DynamicPointElement], [PointElement, DynamicPointElement]);
  }


  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(LineElement.createConnection(point1, point2));
  }
}
