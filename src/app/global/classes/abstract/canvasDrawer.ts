import {RenderingContext} from "../renderingContext";

export abstract class CanvasDrawer {
  public abstract draw(ctx: RenderingContext): void;
}
