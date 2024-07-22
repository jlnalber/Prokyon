import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {CanvasElement} from "../abstract/canvasElement";

export default abstract class TwoElementsSelectMode<T1 extends CanvasElement, T2 extends CanvasElement> extends MoveMode {

  protected constructor(private types1: Constructor<T1>[], private types2: Constructor<T2>[]) {
    super();
  }

  protected selectedElement: T1 | T2 | undefined;

  // should add the canvas element between two points
  protected abstract addCanvasElement(drawerService: DrawerService, e1: T1, e2: T2): void;

  override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {

    drawerService.selection.empty();

    // choose two points and add the element between them
    // thus, only allow to select certain types
    const clickedElement = drawerService.getSelection(point, (c: CanvasElement) => {
      return (this.selectedElement === undefined && (ofType(c, ...this.types1) || ofType(c, ...this.types2)))
          || (ofType(this.selectedElement, ...this.types1) && ofType(c, ...this.types2))
          || (ofType(this.selectedElement, ...this.types2) && ofType(c, ...this.types1))
    }) as T1 | T2 | undefined;

    if (clickedElement !== undefined && clickedElement !== this.selectedElement) {
      if (this.selectedElement !== undefined) {
        // after two selected elements, emit the addCanvasElement method
        if (ofType(this.selectedElement, ...this.types1) && ofType(clickedElement, ...this.types2)) {
          this.addCanvasElement(drawerService, this.selectedElement as T1, clickedElement as T2);
        }
        else if (ofType(this.selectedElement, ...this.types2) && ofType(clickedElement, ...this.types1)) {
          this.addCanvasElement(drawerService, clickedElement as T1, this.selectedElement as T2);
        }
        this.selectedElement = undefined;
      }
      else {
        this.selectedElement = clickedElement;
        drawerService.selection.set(clickedElement);
      }
    }
    else {
      this.selectedElement = undefined;
    }
  }
}


export type Constructor<T> = new (...args: any[]) => T;
export function ofType<TElement, TFilter extends TElement>(el: TElement, ...filterTypes: Constructor<TFilter>[]): boolean {
  for (let filterType of filterTypes) {
    if (el instanceof filterType) {
      return true;
    }
  }
  return false;
}
