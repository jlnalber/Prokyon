import {Event} from "./event";
import {CanvasDrawer} from "./canvasDrawer";
import {Type} from "@angular/core";

export interface CanvasElementConfiguration {
  label?: string,
  name?: string,
  formula?: string,
  editable?: boolean
}

export abstract class CanvasElement extends CanvasDrawer {
  public readonly onChange: Event<any> = new Event<any>();

  // public abstract readonly componentType: Type<any>;

  public configuration: CanvasElementConfiguration = {};
}
