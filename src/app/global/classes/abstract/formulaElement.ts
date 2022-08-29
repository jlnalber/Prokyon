import {CanvasElement} from "./canvasElement";
import {ContextMenu} from "../../../context-menu/context-menu.directive";
import {Event} from "../../essentials/event";
import {Point} from "../../interfaces/point";

export abstract class FormulaElement {
  public abstract canvasElement: CanvasElement;
  public get contextMenu(): ContextMenu {
    return {
      elements: [],
      additionalEvent: this.threePointsClickedEvent
    }
  }

  // note, for three points functionality, you need to add the event on 'additionalEvent' in 'contextMenu', if you override it
  public readonly threePointsClickedEvent: Event<Point> = new Event<Point>();
  threePointsClicked(ev: MouseEvent) {
    // open the three point menu (instance of contextMenu)
    ev.stopPropagation();
    let button: Element = ev.target as Element;
    if (button instanceof HTMLSpanElement) {
      button = button.parentElement!;
    }
    let rect = button.getBoundingClientRect();
    this.threePointsClickedEvent.emit({
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
    });
  }
}
