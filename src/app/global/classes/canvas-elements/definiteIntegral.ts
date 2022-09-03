import {CanvasElement} from "../abstract/canvasElement";
import {FormulaElement} from "../abstract/formulaElement";
import {Type} from "@angular/core";
import {RenderingContext} from "../renderingContext";
import {
  DefiniteIntegralFormulaComponent
} from "../../../formula-tab/definite-integral-formula/definite-integral-formula.component";
import {BLACK, Color, colorAsTransparent, TRANSPARENT} from "../../interfaces/color";
import {Graph} from "./graph";
import {Rect} from "../../interfaces/rect";
import {correctRect, doRectsCollide, getDistanceToRect} from "../../essentials/utils";
import {Point} from "../../interfaces/point";

export default class DefiniteIntegral extends CanvasElement {

  public readonly componentType: Type<FormulaElement> = DefiniteIntegralFormulaComponent;

  private _value: number = 0;
  public get value(): number {
    return this._value;
  }
  private set value(value: number) {
    this._value = value;
  }

  private rects: Rect[] = [];

  private _graph: Graph;
  public get graph(): Graph {
    return this._graph;
  }
  public set graph(value: Graph) {
    this._graph = value;
    this.onChange.emit(value);
  }

  private _stroke: Color;
  public get stroke(): Color {
    return this._stroke;
  }
  public set stroke(value: Color) {
    this._stroke = value;
    this.onChange.emit(value);
  }

  private _strokeWidth: number;
  public get strokeWidth(): number {
    return this._strokeWidth;
  }
  public set strokeWidth(value: number) {
    this._strokeWidth = value;
    this.onChange.emit(value);
  }

  private _h: number = 1;
  public get h(): number {
    return this._h;
  }
  public set h(value: number) {
    this._h = this.correctH(value);
    this.onChange.emit(this._h);
  }
  private correctH(h: number): number {
    if (h < 0) {
      h = -h;
    } else if (!h) {
      h = 1;
    }
    return h;
  }

  private _from: number;
  public get from(): number {
    return this._from;
  }
  public set from(value: number) {
    this._from = Math.min(value, this.to);
    this.onChange.emit(this._from);
  }

  private _to: number;
  public get to(): number {
    return this._to;
  }
  public set to(value: number) {
    this._to = Math.max(value, this.from);
    this.onChange.emit(this._to);
  }

  constructor(graph: Graph, from: number, to: number, h: number = 1, color: Color = BLACK, stroke: Color = TRANSPARENT, strokeWidth: number = 0, visible: boolean = true) {
    super();

    // Set the properties.
    this._graph = graph;
    this._color = color;
    this._stroke = stroke;
    this._strokeWidth = strokeWidth;
    this._visible = visible;
    this._h = h;
    this._from = from;
    this._to = to;
  }

  public reload(variables: any): void {
    let rects: Rect[] = [];
    let sum = 0;

    // Helper function for handling a step.
    const handleStep = (x: number, h: number) => {
      if (h !== 0) {
        try {
          const y = this.graph.func.evaluate(x, variables);

          if (isFinite(y)) {
            // Calculate the surface and the rect.
            sum += h * y;
            rects.push({
              x,
              y: 0,
              width: h,
              height: y
            })
          }
        } catch { }
      }
    }

    // Go through the steps and calculate the rect and the surface.
    let lastX = this.from;
    for (; lastX <= this.to - this.h; lastX += this.h) {
      handleStep(lastX, this.h);
    }

    // Handle the very last step.
    const remainingH = this.to - lastX;
    handleStep(this.to - remainingH, remainingH);

    // Don't allow negative heights.
    rects = rects.map(rect => correctRect(rect))

    // Save the data.
    this.rects = rects;
    this.value = sum;
  }

  public override draw(ctx: RenderingContext): void {
    // Reload the data.
    this.reload(ctx.variables);

    // Then draw the surface.
    if (this.visible) {
      const range = ctx.range;
      const color = colorAsTransparent(this.color, 0.3);
      for (let rect of this.rects) {
        if (doRectsCollide(rect, range)) {
          ctx.drawRect(rect, color, this.stroke)
        }
      }
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    return Math.min(...this.rects.map(rect => getDistanceToRect(p, rect)));
  }

}
