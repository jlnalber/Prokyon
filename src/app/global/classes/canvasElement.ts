import {Event} from "./event";
import {CanvasDrawer} from "./canvasDrawer";

export interface CanvasElementConfiguration {
  formula?: string,
  editable?: boolean
}

export abstract class CanvasElement extends CanvasDrawer {
  public readonly onChange: Event<any> = new Event<any>();

  public configuration: CanvasElementConfiguration = {};
}
