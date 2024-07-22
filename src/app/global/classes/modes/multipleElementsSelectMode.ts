import MoveMode from "./moveMode";
import {DrawerService} from "../../../services/drawer.service";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import { CanvasElement } from "../abstract/canvasElement";
import { Constructor, ofType } from "./twoElementsSelectMode";

export default abstract class MultipleElementsSelectMode<T extends CanvasElement> extends MoveMode {
  
  protected constructor(private types: Constructor<T>[], private minElements: number, private maxElements: number = Number.MAX_VALUE) {
    super();
  }

  protected abstract addCanvasElement(drawerService: DrawerService, elements: T[]): void;

  private clickedElements: T[] = [];

  public override click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext) {
    const clickedElement = drawerService.getSelection(point, (c) => ofType(c, ...this.types)) as T | undefined;

    if (clickedElement !== undefined) {
      if (this.clickedElements.length === 0) {
        // in case, the first element was clicked
        this.clickedElements.push(clickedElement);
        drawerService.selection.set(clickedElement);
      }
      else if (clickedElement === this.clickedElements[this.clickedElements.length - 1]) {
        // in case, the latest one was selected
        this.clickedElements.splice(this.clickedElements.length - 1);
        if (this.clickedElements.indexOf(clickedElement) === -1) {
          // only remove from selection, if it wasn't in there anymore
          drawerService.selection.remove(clickedElement);
        }
      }
      else if (clickedElement === this.clickedElements[0] && this.clickedElements.length + 1 >= this.minElements && this.clickedElements.length + 1 <= this.maxElements) {
        // in case, we're finished
        const elements = [...this.clickedElements];
        this.clickedElements = [];
        drawerService.selection.empty();
        this.addCanvasElement(drawerService, elements);
      }
      else {
        // just add it
        this.clickedElements.push(clickedElement);
        drawerService.selection.add(clickedElement);
      }
    } else {
      // in case, it was clicked in the void
      drawerService.selection.empty();
      this.clickedElements = [];
    }
  }
}
