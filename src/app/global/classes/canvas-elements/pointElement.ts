import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {PointFormulaComponent} from "../../../formula-tab/point-formula/point-formula.component";
import {Point} from "../../interfaces/point";
import {FormulaElement} from "../abstract/formulaElement";
import {BLACK, Color, colorAsTransparent} from "../../interfaces/color";

export default class PointElement extends CanvasElement {

  public readonly componentType: Type<FormulaElement> = PointFormulaComponent;

  private _color: Color;
  public get color(): Color {
    return this._color;
  }
  public set color(value: Color) {
    this._color = value;
    this.onChange.emit(value);
  }

  private _visible: boolean;
  public get visible(): boolean {
    return this._visible;
  }
  public set visible(value: boolean) {
    this._visible = value;
    this.onChange.emit(value);
  }

  private _stroke: Color = {
    r: 100,
    g: 100,
    b: 100
  }
  public get stroke(): Color {
    return this._stroke;
  }
  public set stroke(value: Color) {
    this._stroke = value;
    this.onChange.emit(value);
  }

  private _strokeWidth: number = 3;
  public get strokeWidth(): number {
    return this._strokeWidth;
  }
  public set strokeWidth(value: number) {
    this._strokeWidth = value;
    this.onChange.emit(value);
  }

  private _radius: number = 5;
  public get radius(): number {
    return this._radius;
  }
  public set radius(value: number) {
    this._radius = value;
    this.onChange.emit(value);
  }

  private _x: number;
  private _y: number;
  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
    this.onChange.emit(value);
  }
  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
    this.onChange.emit(value);
  }

  constructor(p: Point, color: Color = BLACK, public readonly name?: string, visible: boolean = true) {
    super();
    this._x = p.x;
    this._y = p.y;
    this._color = color;
    this._visible = visible;
  }

  public override draw(ctx: RenderingContext): void {
    if (ctx.selection.indexOf(this) !== -1) {
      ctx.drawCircle(this.point, 1.75 * this.radius, colorAsTransparent(this.color, 0.3))
    }
    if (this.visible) {
      ctx.drawCircle(this.point, this.radius, this.color, this.stroke, this.strokeWidth);
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    // calculate the distance, subtract the radius --> point in canvas isn't a perfect geometric point but has a radius
    return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2) - this.radius / ctx.zoom;
  }

  public get point(): Point {
    return {
      x: this.x,
      y: this.y
    }
  }

}
