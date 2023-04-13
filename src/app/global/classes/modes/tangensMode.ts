import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import CircleElement from "../canvas-elements/circleElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";

export default class TangensMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, CircleElement> {
  constructor() {
    super([PointElement, DynamicPointElement], [CircleElement]);
  }

  protected override addCanvasElement(drawerService: DrawerService, e1: PointElement | DynamicPointElement, e2: CircleElement) {
    drawerService.addCanvasElements(...LineElement.createTangens(e1, e2));
  }

}
