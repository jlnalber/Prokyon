import {Event} from "../../essentials/event";
import {CanvasDrawer} from "./canvasDrawer";
import {Type} from "@angular/core";
import {FormulaElement} from "./formulaElement";
import {Point} from "../../interfaces/point";
import {RenderingContext} from "../renderingContext";

export interface CanvasElementConfiguration {
  label?: string,
  name?: string,
  formula?: string,
  editable?: boolean
}

export abstract class CanvasElement extends CanvasDrawer {
  public readonly onChange: Event<any> = new Event<any>();

  public abstract readonly componentType: Type<FormulaElement>;

  public getDistance(p: Point, ctx: RenderingContext): number | undefined {
    return undefined;
  }

  public configuration: CanvasElementConfiguration = {};

  public onRemove(): void { }
}
