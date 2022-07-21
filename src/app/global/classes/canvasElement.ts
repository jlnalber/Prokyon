import {RenderingContext} from "./renderingContext";
import {Event} from "./event";

export interface CanvasElementConfiguration {
  formula?: string,
  editable?: boolean
}

export abstract class CanvasElement {
  public abstract draw(ctx: RenderingContext): void;
  public readonly onChange: Event<any> = new Event<any>();

  public configuration: CanvasElementConfiguration = {};
}
