import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Func} from "../func/func";
import {Color, colorAsTransparent} from "../../interfaces/color";
import {Point} from "../../interfaces/point";
import {correctRect, isIn, isInRange} from "../../essentials/utils";
import {GraphFormulaComponent} from "../../../formula-tab/graph-formula/graph-formula.component";
import {getDistanceToStraightLine} from "../../essentials/straightLineUtils";
import {CanvasElementSerialized} from "../../essentials/serializer";
import {DrawerService} from "../../../services/drawer.service";


export type ParseAndValidateProviderGraph = (t: string) => Func | string;

type Data = {
  formula?: string
}

export const TRANSPARENCY_RATIO = 0.3;
export const LINE_WIDTH_SELECTED_RATIO = 2.5;

export class Graph extends CanvasElement {

  public readonly componentType = GraphFormulaComponent;
  public override formulaDialogType = undefined;

  private _funcText: string = "0";
  private _funcErrorText: undefined | string;
  private _func: Func | undefined;
  public get func(): Func | undefined {
    return this._func;
  }

  public get funcText(): string {
    return this._funcText;
  }
  public set funcText(value: string) {
    this._funcText = value;
    this.reparse();
    this.onChange.emit(value);
  }

  public get funcErrorText(): string | undefined {
    return this._funcErrorText;
  }

  public get funcError(): boolean {
    return this.funcErrorText !== undefined;
  }

  constructor(private readonly parseAndValidateProvider: ParseAndValidateProviderGraph,
              func?: Func | string | undefined,
              color: Color = { r: 0, g: 0, b: 0 },
              visible: boolean = true,
              public lineWidth: number = 3,
              showLabel: boolean = true) {
    super();
    if (func instanceof Func) {
      this._func = func;
      this.configuration.label = func?.name;
      this._funcText = func.operationAsString;
    } else if (typeof func === 'string') {
      this._funcText = func;
    }
    this.configuration.showLabel = showLabel;
    this.svgLabel = undefined;
    this._color = color;
    this._visible = visible;
  }

  public override draw(ctx: RenderingContext) {
    if (this.funcError || this.func === undefined) {
      this.reparse();
    }

    if (this.funcError || this.func === undefined) {
      return;
    }

    // draw the graph

    // for that purpose, sometimes more than one path has to be drawn
    const paths: Point[][] = [];
    let curPath: Point[] = [];

    // get the metadata of the canvas
    const rangeRect = ctx.range;
    const step = ctx.step;
    let curStep = step;

    // get the selection
    const selected = ctx.selection.indexOf(this) !== -1;
    const colorSelected = colorAsTransparent(this._color, TRANSPARENCY_RATIO);
    const lineWidthSelected = this.lineWidth * LINE_WIDTH_SELECTED_RATIO;

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
        const y = this._func!.evaluate(x, ctx.variables);
        if (isFinite(y)) {
          return {
            x,
            y
          }
        }
      } catch {
      }
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
          // If the graph jumps over the viewport (because of very steep elevation), the line is still rendered with a point in between.
          if (!split && lastPointIfOutsideRect && isInRange(rangeRect.y, lastPointIfOutsideRect.y, p.y)) {
            const averageX = (lastPointIfOutsideRect.x + p.x) / 2
            const centerPoint: Point | undefined = tryGetPoint(averageX);
            if (centerPoint && isInRange(centerPoint.y, lastPointIfOutsideRect.y, p.y)) {
              curPath.push(lastPointIfOutsideRect, centerPoint, p);
            }
          }

          // Split because the point isn't in the viewport.
          split = true
        }

        lastPointIfOutsideRect = p;
      } else if (p) {
        // Add the last point outside the rect if the points are back again in the rect.
        if (lastPointIfOutsideRect && lastElevation !== undefined && !split) {
          curPath.push(lastPointIfOutsideRect);
          lastElevation = (p.y - lastPointIfOutsideRect.y) / (p.x - lastPointIfOutsideRect.x);
        }

        lastPointIfOutsideRect = undefined;
      }

      // Add the point.
      if (p && !split) {
        curPath.push(p);
      }

      // Set the last point to the current point.
      lastPoint = p;

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
      ctx.drawPath(path, this.lineWidth, this._color, undefined, this.configuration.dashed);
      if (selected) {
        ctx.drawPath(path, lineWidthSelected, colorSelected, undefined, this.configuration.dashed);
      }
    }

  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    // Try to simulate straight lines and calculate the distance to them.
    try {
      const x1 = p.x - ctx.step;
      const x2 = p.x;
      const x3 = p.x + ctx.step;

      const p1: Point = {
        x: x1,
        y: this.func!.evaluate(x1, ctx.variables)
      }
      const p2: Point = {
        x: x2,
        y: this.func!.evaluate(x2, ctx.variables)
      }
      const p3: Point = {
        x: x3,
        y: this.func!.evaluate(x3, ctx.variables)
      }

      let dist1 = getDistanceToStraightLine(p, p1, p2);
      let dist2 = getDistanceToStraightLine(p, p2, p3);
      dist1 = isFinite(dist1) ? dist1 : Infinity;
      dist2 = isFinite(dist2) ? dist2 : Infinity;

      if (dist1 !== Infinity || dist2 !== Infinity) {
        return Math.min(dist1, dist2);
      }
    } catch { }

    // Try an easier way:
    try {
      return Math.abs(p.y - this.func!.evaluate(p.x, ctx.variables));
    } catch { }
    return undefined;
  }

  public static getDefaultInstance(drawerService: DrawerService): Graph {
    return new Graph(drawerService.parseAndValidateProviderGraph);
  }

  public override serialize(): CanvasElementSerialized {
    const data: Data = {
      formula: this.funcText
    }
    return {
      data,
      style: {
        color: this.color,
        visible: this.visible,
        size: this.lineWidth
      }
    }
  }

  public override loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService) {
    this.color = canvasElementSerialized.style.color;
    this.visible = canvasElementSerialized.style.visible;
    this.lineWidth = canvasElementSerialized.style.size ?? this.lineWidth;

    const data: Data = canvasElementSerialized.data as Data;
    try {
      if (data.formula !== undefined) {
        this._funcText = data.formula;
      }
    } // here may be an exception for when the order of the functions has a cycle for example
    catch { }
  }

  public reparse() {
    const res = this.parseAndValidateProvider(this._funcText);
    if (res instanceof Func) {
      this._func = res;
      this._funcErrorText = undefined;
      this.configuration.label = res.name;
      this.svgLabel = undefined;
      return true;
    }
    else {
      this._func = undefined;
      this._funcErrorText = res;
      this.configuration.label = undefined;
      this.svgLabel = undefined;
      return false;
    }
  }

  public reparseIfNecessary(): boolean {
    if (this.funcError || this.func === undefined) {
      return this.reparse();
    }
    return true;
  }

  public override getPositionForLabel(rtx: RenderingContext): Point | undefined {
    const rect = correctRect(rtx.range);
    try {
      const distX = 0.1;
      const distY = 0.05;
      const x = rect.x + rect.width * (0.5 + distX);
      const y = this.func!.evaluate(x) + rect.height * distY;
      return {
        x,
        y
      }
    } catch {
      return undefined;
    }
  }

  public clone(): Graph {
    const c = new Graph(this.parseAndValidateProvider, this.funcText, this.color, this.visible, this.lineWidth, this.configuration.showLabel);
    c.configuration = { ...this.configuration };
    c.svgLabel = undefined;

    return c;
  }

  public derive(color?: Color): Graph | undefined {
    try {
      let derivedGraph = new Graph(this.parseAndValidateProvider, this.func?.derive(), color ?? this.color);
      derivedGraph.configuration.editable = true;
      return derivedGraph
    }
    catch {
      return undefined;
    }
  }

  public canDerive(): boolean {
    try {
      if (this.func === undefined) return false;
      this.func.derive();
      return true;
    }
    catch {
      return false;
    }
  }

}
