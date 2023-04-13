import {Event} from "../../essentials/event";
import {CanvasDrawer} from "./canvasDrawer";
import {Type} from "@angular/core";
import {FormulaElement} from "./formulaElement";
import {Point} from "../../interfaces/point";
import {RenderingContext} from "../renderingContext";
import {BLACK, Color} from "../../interfaces/color";
import {DrawerService} from "../../../services/drawer.service";
import getNewID from "../../essentials/idProvider";
import {CanvasElementSerialized} from "../../essentials/serializer";

export interface CanvasElementConfiguration {
  label?: string,
  name?: string,
  formula?: string,
  editable?: boolean
}

export abstract class CanvasElement extends CanvasDrawer {
  public readonly id: number;

  public readonly onChange: Event<any> = new Event<any>();
  public readonly onRemove: Event<DrawerService> = new Event<DrawerService>();

  public abstract readonly componentType: Type<FormulaElement>;

  public abstract serialize(): CanvasElementSerialized;
  public abstract loadFrom(canvasElements: { [id: number]: CanvasElement | undefined }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void;

  public getDistance(p: Point, ctx: RenderingContext): number | undefined {
    return undefined;
  }

  public configuration: CanvasElementConfiguration = {};

  protected _color: Color = BLACK;
  public get color(): Color {
    return this._color;
  }
  public set color(value: Color) {
    this._color = value;
    this.onChange.emit(value);
  }

  protected _visible: boolean = true;
  public get visible(): boolean {
    return this._visible;
  }
  public set visible(value: boolean) {
    this._visible = value;
    this.onChange.emit(value);
  }

  protected constructor() {
    super();
    this.id = getNewID();
  }
}
