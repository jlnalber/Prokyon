import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import CircleElement from "../canvas-elements/circleElement";
import {GREY} from "../../interfaces/color";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default class CircleMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, PointElement | DynamicPointElement> {

  public constructor() {
    super([PointElement, DynamicPointElement], [PointElement, DynamicPointElement]);
  }


  protected override addCanvasElement(drawerService: DrawerService, point1: PointElement, point2: PointElement) {
    drawerService.addCanvasElements(new CircleElement(() => point1.point,
      () => (point1.point !== undefined && point2.point !== undefined)
        ? Math.sqrt((point1.point.x  - point2.point.x) ** 2 + (point1.point.y - point2.point.y) ** 2)
        : undefined, [point1, point2], () => {
        return {
          center: point1.id,
          scdPoint: point2.id
        }
      },
      GREY, 'Verbindungskreis'))
  }
}
