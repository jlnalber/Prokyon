import MoveMode from "./moveMode";
import PointElement from "../canvas-elements/pointElement";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {CanvasElement} from "../abstract/canvasElement";

export default abstract class TwoElementsSelectMode<T1 extends CanvasElement, T2 extends CanvasElement> extends MoveMode {

  protected constructor(private type1: Constructor<T1>, private type2: Constructor<T2>) {
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
      return (this.selectedElement === undefined && (ofType(c, this.type1) || ofType(c, this.type2)))
          || (ofType(this.selectedElement, this.type1) && ofType(c, this.type2))
          || (ofType(this.selectedElement, this.type2) && ofType(c, this.type1))
    }) as T1 | T2 | undefined;

    if (clickedElement !== undefined && clickedElement !== this.selectedElement) {
      if (this.selectedElement !== undefined) {
        // after two selected elements, emit the addCanvasElement method
        if (ofType(this.selectedElement, this.type1)) {
          this.addCanvasElement(drawerService, this.selectedElement as T1, clickedElement as T2);
        }
        else {
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


type Constructor<T> = new (...args: any[]) => T;
function ofType<TElement, TFilter extends TElement>(el: TElement, filterType: Constructor<TFilter>): boolean {
  return el instanceof filterType;
}
