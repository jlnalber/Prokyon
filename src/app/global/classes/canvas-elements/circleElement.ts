import {CanvasElement} from "../abstract/canvasElement";
import {Point} from "../../interfaces/point";
import {Color, colorAsTransparent, TRANSPARENT} from "../../interfaces/color";
import {Type} from "@angular/core";
import {RenderingContext} from "../renderingContext";
import {getDistance} from "../../essentials/utils";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";
import {GeometricFormulaComponent} from "../../../formula-tab/geometric-formula/geometric-formula.component";
import DynamicElement from "./dynamicElement";

export default class CircleElement extends DynamicElement {

  public readonly componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;

  private _pointProvider: PointProvider;

  public get point(): Point | undefined {
    return this._pointProvider();
  }

  public get pointProvider(): PointProvider {
    return this._pointProvider;
  }

  public set pointProvider(value: PointProvider) {
    this._pointProvider = value;
    this.onChange.emit(value);
  }

  private _radiusProvider: RadiusProvider;

  public get radius(): number | undefined {
    return this._radiusProvider();
  }

  public get radiusProvider(): RadiusProvider {
    return this._radiusProvider;
  }

  public set radiusProvider(value: RadiusProvider) {
    this._radiusProvider = value;
    this.onChange.emit(value);
  }

  constructor(pointProvider: PointProvider, radiusProvider: RadiusProvider, dependencies: CanvasElement[], color: Color = { r: 0, g: 0, b: 0 }, formula?: string, visible: boolean = true, public lineWidth: number = 3) {
    super(dependencies);
    this.configuration.formula = formula;
    this._color = color;
    this._visible = visible;
    this._pointProvider = pointProvider;
    this._radiusProvider = radiusProvider;
  }

  public draw(ctx: RenderingContext): void {
    const point = this.point;
    const radius = this.radius;

    if (this.visible && point !== undefined && radius !== undefined) {
      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawCircle(point, radius, TRANSPARENT, colorAsTransparent(this._color, TRANSPARENCY_RATIO), this.lineWidth * LINE_WIDTH_SELECTED_RATIO);
      }
      ctx.drawCircle(point, radius, TRANSPARENT, this.color, this.lineWidth);
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    const point = this.point;
    const radius = this.radius;
    if (point !== undefined && radius !== undefined) {
      return Math.abs(getDistance(point, p) - radius);
    }

    return undefined;
  }
}

type PointProvider = () => (Point | undefined);
type RadiusProvider = () => (number | undefined);
