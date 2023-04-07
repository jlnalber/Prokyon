import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {PointFormulaComponent} from "../../../formula-tab/point-formula/point-formula.component";
import {Point} from "../../interfaces/point";
import {FormulaElement} from "../abstract/formulaElement";
import {BLACK, Color, colorAsTransparent} from "../../interfaces/color";
import {isIn} from "../../essentials/utils";
import DynamicElement from "./dynamicElement";

export default class PointElement extends DynamicElement {

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

  private _x: number | undefined;
  private _y: number | undefined;

  public get x(): number | undefined {
    return this._x;
  }

  public set x(value: number | undefined) {
    if (!this.dependent) {
      this._x = value;
      this.onChange.emit(value);
    }
  }

  public get y(): number | undefined {
    return this._y;
  }

  public set y(value: number | undefined) {
    if (!this.dependent) {
      this._y = value;
      this.onChange.emit(value);
    }
  }

  public set point(value: Point | undefined) {
    if (!this.dependent) {
      this._x = value?.x;
      this._y = value?.y;
      this.onChange.emit(value);
    }
  }

  public get point(): Point | undefined {
    if (this.x !== undefined && this.y !== undefined) {
      return {
        x: this.x,
        y: this.y
      }
    }
    return undefined;
  }

  // indicates whether this point is element of a selected dependencyPointElements
  public selected: boolean = false;

  // the constructor, dependent means that the point is dependent of another canvas element
  constructor(p: Point | undefined, color: Color = BLACK, public readonly dependent = false, dependencies: CanvasElement[] = [], public readonly name?: string, visible: boolean = true) {
    super(dependencies);
    this._x = p?.x;
    this._y = p?.y;
    this._color = color;
    this._visible = visible;
  }

  public override draw(ctx: RenderingContext): void {
    const selectionRadiusFactor = 1.75;
    const point = this.point;
    if (this.visible && point !== undefined && isIn(point, ctx.range, selectionRadiusFactor * this.radius / ctx.zoom)) {
      if (this.selected || ctx.selection.indexOf(this) !== -1) {
        ctx.drawCircle(point, selectionRadiusFactor * this.radius / ctx.zoom, colorAsTransparent(this.color, 0.3))
      }
      ctx.drawCircle(point, this.radius / ctx.zoom, this.color, this.stroke, this.strokeWidth);
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    const t = this.point;
    if (t !== undefined) {
      // calculate the distance, subtract the radius --> point in canvas isn't a perfect geometric point but has a radius
      return Math.sqrt((t.x - p.x) ** 2 + (t.y - p.y) ** 2) - this.radius / ctx.zoom;
    }
    return undefined;
  }

}
