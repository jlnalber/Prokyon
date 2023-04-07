import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";
import CircleElement from "../canvas-elements/circleElement";
import {DrawerService} from "../../../services/drawer.service";
import LineElement from "../canvas-elements/lineElement";
import {getTangens} from "../../essentials/geometryUtils";
import {GREY} from "../../interfaces/color";

export default class TangensMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, CircleElement> {
  constructor() {
    super([PointElement, DynamicPointElement], [CircleElement]);
  }

  protected override addCanvasElement(drawerService: DrawerService, e1: PointElement | DynamicPointElement, e2: CircleElement) {
    drawerService.addCanvasElements(new LineElement(() => {
      return getTangens(e1.point, e2.point, e2.radius)[0];
    }, [e1, e2], GREY, 'Tangente'));
    drawerService.addCanvasElements(new LineElement(() => {
      return getTangens(e1.point, e2.point, e2.radius)[1];
    }, [e1, e2], GREY, 'Tangente'));
  }

}
