import {CanvasElement} from "./canvasElement";
import {ContextMenu} from "../../../context-menu/context-menu.directive";

export abstract class FormulaElement {
  public abstract canvasElement: CanvasElement;
  public get contextMenu(): ContextMenu {
    return {
      elements: []
    }
  }
}
