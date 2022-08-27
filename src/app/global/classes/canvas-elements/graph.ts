import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Func} from "../func/func";
import {BLACK, Color, colorAsTransparent} from "../../interfaces/color";
import {Point} from "../../interfaces/point";
import {expandRectBy, isIn} from "../../essentials/utils";
import {GraphFormulaComponent} from "../../../formula-tab/graph-formula/graph-formula.component";

export class Graph extends CanvasElement {

  public readonly componentType = GraphFormulaComponent;

  private _func: Func;
  public get func(): Func {
    return this._func;
  }
  public set func(value: Func) {
    this._func = value;
    this.onChange.emit(value);
  }

  private _color: Color = BLACK;
  public get color(): Color {
    return this._color;
  }
  public set color(value: Color) {
    this._color = value;
    this.onChange.emit(value);
  }

  private _visible: boolean = true;
  public get visible(): boolean {
    return this._visible;
  }
  public set visible(value: boolean) {
    this._visible = value;
    this.onChange.emit(value);
  }

  constructor(func: Func, color: Color = { r: 0, g: 0, b: 0 }, visible: boolean = true, public lineWidth: number = 3) {
    super();
    this._func = func;
    this._color = color;
    this._visible = visible;
  }

  public override draw(ctx: RenderingContext) {
    // draw the graph
    if (this.visible) {
      // for that purpose, sometimes more than one path has to be drawn
      let paths: Point[][] = [];
      let curPath: Point[] = [];

      // get the metadata of the canvas
      let rangeRect = ctx.range;
      let drawRect = expandRectBy(rangeRect, 5);
      let step = ctx.step;
      let curStep = step;

      // get the selection
      const selected = ctx.selection.indexOf(this) !== -1;
      const colorSelected = colorAsTransparent(this.color, 0.3);
      const lineWidthSelected = this.lineWidth * 2.5;

      // get possible points
      let lastElevation: number | undefined = undefined;
      let lastPoint: Point | undefined;
      for (let x = rangeRect.x; x < rangeRect.x + rangeRect.width; x += curStep) {
        let split = false;
        try {
          let y = this.func.evaluate(x, ctx.variables);
          if (isNaN(y)) throw 'value NaN';
          let p = {
            x: x,
            y: y
          }

          // check whether the elevation is rapidly changing, then split
          if (lastPoint) {
            let elevation = (p.y - lastPoint.y) / (p.x - lastPoint.x);

            if (lastElevation != undefined) {
              let ratio = elevation / (lastElevation == 0 ? 1 : lastElevation);
              if (Math.abs(elevation) > 10) {
                if (ratio < 0) {
                  split = true;
                } else if (ratio > 10) {
                  split = true;
                }
              }
            }

            if (!split) {
              lastElevation = elevation;
            }
            else {
              lastElevation = undefined;
            }

            curStep = step / Math.min(Math.max(1, Math.abs(elevation / 10)), 100);
          }

          // check whether the point is in a certain rect
          if (!isIn(p, drawRect)) {
            split = true
          }

          // add the point
          if (!split) {
            lastPoint = p;
            curPath.push(p);
          }
          else {
            lastPoint = undefined;
          }
        }
        catch {
          split = true;
        }

        if (split && curPath.length != 0) {
          paths.push(curPath);
          curPath = [];
        }
      }
      if (curPath.length != 0) {
        paths.push(curPath);
      }

      // then draw all paths
      for (let path of paths) {
        ctx.drawPath(path, this.lineWidth, this.color);
        if (selected) {
          ctx.drawPath(path, lineWidthSelected, colorSelected);
        }
      }
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    try {
      return Math.abs(p.y - this.func.evaluate(p.x, ctx.variables));
    } catch {
      return undefined;
    }
  }

}
