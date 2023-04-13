import TwoElementsSelectMode from "./twoElementsSelectMode";
import PointElement from "../canvas-elements/pointElement";
import LineElement from "../canvas-elements/lineElement";
import {DrawerService} from "../../../services/drawer.service";
import LineSegmentElement from "../canvas-elements/lineSegmentElement";
import DynamicPointElement from "../canvas-elements/dynamicPointElement";

export default class OrthogonalMode extends TwoElementsSelectMode<PointElement | DynamicPointElement, LineElement | LineSegmentElement> {
  constructor() {
    super([PointElement, DynamicPointElement], [LineElement, LineSegmentElement]);
  }

  protected addCanvasElement(drawerService: DrawerService, e1: PointElement, e2: LineElement | LineSegmentElement): void {
    drawerService.addCanvasElements(LineElement.createOrthogonal(e1, e2));
  }
}
