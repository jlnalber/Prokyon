import {CanvasElement} from "../abstract/canvasElement";
import {DrawerService} from "../../../services/drawer.service";

export default abstract class DynamicElement extends CanvasElement {
  protected constructor(dependencies: CanvasElement[]) {
    super();
    for (let i of dependencies) {
      i.onRemove.addListener(this.removeListener);
    }
  }

  private readonly removeListener = (drawerService?: DrawerService) => {
    if (drawerService !== undefined) {
      drawerService.removeCanvasElements(this);
    }
  }
}
