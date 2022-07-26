import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {PointFormulaComponent} from "../../../formula-tab/point-formula/point-formula.component";
import {Point} from "../../interfaces/point";
import {FormulaElement} from "../abstract/formulaElement";
import {BLACK, Color, colorAsTransparent} from "../../interfaces/color";
import {isIn} from "../../essentials/utils";

export default class PointElement extends CanvasElement {

  public readonly componentType: Type<FormulaElement> = PointFormulaComponent;

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

  public set point(value: Point) {
    this._x = value.x;
    this._y = value.y;
    this.onChange.emit(value);
  }
  public get point(): Point {
    return {
      x: this.x,
      y: this.y
    }
  }

  public selected: boolean = false;

  constructor(p: Point, color: Color = BLACK, public readonly name?: string, visible: boolean = true) {
    super();
    this._x = p.x;
    this._y = p.y;
    this._color = color;
    this._visible = visible;
  }

  public override draw(ctx: RenderingContext): void {
    const selectionRadiusFactor = 1.75;
    const point = this.point;
    if (this.visible && isIn(point, ctx.range, selectionRadiusFactor * this.radius / ctx.zoom)) {
      if (this.selected || ctx.selection.indexOf(this) !== -1) {
        ctx.drawCircle(point, selectionRadiusFactor * this.radius, colorAsTransparent(this.color, 0.3))
      }
      ctx.drawCircle(point, this.radius, this.color, this.stroke, this.strokeWidth);
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    // calculate the distance, subtract the radius --> point in canvas isn't a perfect geometric point but has a radius
    return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2) - this.radius / ctx.zoom;
  }

}
