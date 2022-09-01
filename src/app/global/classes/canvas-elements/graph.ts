import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Func} from "../func/func";
import {BLACK, Color, colorAsTransparent} from "../../interfaces/color";
import {Point} from "../../interfaces/point";
import {isIn, isInRange} from "../../essentials/utils";
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
      const paths: Point[][] = [];
      let curPath: Point[] = [];

      // get the metadata of the canvas
      const rangeRect = ctx.range;
      const step = ctx.step;
      let curStep = step;

      // get the selection
      const selected = ctx.selection.indexOf(this) !== -1;
      const colorSelected = colorAsTransparent(this._color, 0.3);
      const lineWidthSelected = this.lineWidth * 2.5;

      // helper functions
      const splitDueToRapidElevationChange = (elevation: number, lastElevation?: number): boolean => {
        if (lastElevation !== undefined) {
          const ratio = elevation / (lastElevation === 0 ? 1 : lastElevation);
          if (Math.abs(elevation) > 10) {
            if (ratio < 0) {
              return true;
            } else if (ratio > 15) {
              return true;
            }
          }
        }

        return false;
      }
      const tryGetPoint = (x: number): Point | undefined => {
        try {
          const y = this._func.evaluate(x, ctx.variables);
          if (!isNaN(y)) {
            return {
              x,
              y
            }
          }
        } catch { }
        return undefined;
      }

      // get possible points
      let lastElevation: number | undefined = undefined;
      let lastPoint: Point | undefined = undefined;
      let lastPointIfOutsideRect: Point | undefined = undefined;
      for (let x = rangeRect.x; x < rangeRect.x + rangeRect.width; x += curStep) {
        let split = false;

        // Get the point (evaluation might fail).
        const p = tryGetPoint(x);
        if (!p) {
          split = true;
          lastPointIfOutsideRect = undefined;
        }

        // Check whether the elevation is rapidly changing, in that case split.
        if (p && lastPoint) {
          const elevation = (p.y - lastPoint.y) / (p.x - lastPoint.x);
          split = split || splitDueToRapidElevationChange(elevation, lastElevation);

          lastElevation = split ? undefined : elevation;

          // 'curStep' is used to draw more precisely when the elevation is great. E.g. tan(x) needs to be rendered with smaller steps ´because it is very steep.
          curStep = step / Math.min(Math.max(1, Math.abs(elevation / 5)), 15);
        }

        // Check whether the point is in a certain rect.
        // If not, don't draw it.
        // Problem: If you don't draw the first point outside the rect, there will be a gap at the bottom or top.
        // Therefore, the first point outside fo the rect still has to be drawn + the last point still outside the rect as well.
        if (p && !isIn(p, rangeRect)) {
          // Only split if it's the second point outside the rect.
          if (lastPointIfOutsideRect || x === rangeRect.x) {
            split = true

            // If the graph jumps over the viewport (because of very steep elevation), the line is still rendered with a point in between.
            if (lastPointIfOutsideRect && isInRange(rangeRect.y, lastPointIfOutsideRect.y, p.y)) {
              const averageX = (lastPointIfOutsideRect.x + p.x) / 2
              const centerPoint: Point | undefined = tryGetPoint(averageX);
              if (centerPoint && isInRange(centerPoint.y, lastPointIfOutsideRect.y, p.y)) {
                curPath.push(lastPointIfOutsideRect, centerPoint, p);
              }
            }
          }

          lastPointIfOutsideRect = p;
        } else if (p) {
          // Add the last point outside the rect if the points are back again in the rect.
          if (lastPointIfOutsideRect && lastElevation) {
            curPath.push(lastPointIfOutsideRect);
            lastElevation = (p.y - lastPointIfOutsideRect.y) / (p.x - lastPointIfOutsideRect.x);
          }
          lastPointIfOutsideRect = undefined;
        }

        // Add the point.
        if (p && !split) {
          lastPoint = p;
          curPath.push(p);
        } else {
          lastPoint = undefined;
        }

        // If the path needs to be split
        if (split && curPath.length != 0) {
          paths.push(curPath);
          curPath = [];
        }
      }

      // Add the last path to the paths.
      if (curPath.length != 0) {
        paths.push(curPath);
      }

      // Then, draw all paths.
      for (let path of paths) {
        ctx.drawPath(path, this.lineWidth, this._color);
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
