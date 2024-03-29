import {CanvasElement} from "../abstract/canvasElement";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";

export default abstract class DynamicElement extends CanvasElement {
  protected constructor(dependencies: CanvasElement[]) {
    super();
    this.addDependency(...dependencies);

    this.onAdd.addListener((d) => {
      if (d !== undefined && this.resetTempListener !== undefined) {
        d.onBeforeElementsDraw.addListener(this.resetTempListener);
        //d.onAfterRedraw.addListener(this.resetTempListener);
      }
    })
    this.onRemove.addListener((d) => {
      if (d !== undefined && this.resetTempListener !== undefined) {
        d.onBeforeElementsDraw.removeListener(this.resetTempListener);
        //d.onAfterRedraw.removeListener(this.resetTempListener);
      }
    })
  }

  private readonly removeListener = (drawerService?: DrawerService) => {
    if (drawerService !== undefined) {
      drawerService.removeCanvasElements(this);
    }
  }

  protected addDependency(...dependencies: CanvasElement[]) {
    for (let i of dependencies) {
      i.onRemove.addListener(this.removeListener);
    }
  }

  protected resetTempListener: ((ctx?: RenderingContext) => void) | undefined;
}
