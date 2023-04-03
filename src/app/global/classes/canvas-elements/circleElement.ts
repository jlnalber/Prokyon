import {CanvasElement} from "../abstract/canvasElement";
import {Point} from "../../interfaces/point";
import {Color, colorAsTransparent, TRANSPARENT} from "../../interfaces/color";
import {Type} from "@angular/core";
import {CircleFormulaComponent} from "../../../formula-tab/circle-formula/circle-formula.component";
import {RenderingContext} from "../renderingContext";
import {getDistance} from "../../essentials/utils";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";

export default class CircleElement extends CanvasElement {

  public readonly componentType: Type<CircleFormulaComponent> = CircleFormulaComponent;

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

  constructor(pointProvider: PointProvider, radiusProvider: RadiusProvider, color: Color = { r: 0, g: 0, b: 0 }, visible: boolean = true, public lineWidth: number = 3) {
    super();
    this._color = color;
    this._visible = visible;
    this._pointProvider = pointProvider;
    this._radiusProvider = radiusProvider;
  }

  public draw(ctx: RenderingContext): void {
    const point = this.point;
    const radius = this.radius;

    if (point !== undefined && radius !== undefined) {
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
