import {CanvasElement} from "../abstract/canvasElement";
import {Color} from "../../interfaces/color";
import {Point} from "../../interfaces/point";
import {
  getABCFormLineFromTwoPoints,
  getIntersectionPointLines,
  getOrthogonalToLineThroughPoint
} from "../../essentials/geometryUtils";
import {getDistance} from "../../essentials/utils";
import {RenderingContext} from "../renderingContext";
import DynamicElement from "./dynamicElement";

// a line of the form ax + by = c between two points
export default abstract class AbstractLine extends DynamicElement {
  private _pointsProvider: PointsProvider;

  public get point1(): Point | undefined {
    return this._pointsProvider()[0];
  }

  public get point2(): Point | undefined {
    return this._pointsProvider()[1];
  }

  public get pointsProvider(): PointsProvider {
    return this._pointsProvider;
  }

  public set pointsProvider(value: PointsProvider) {
    this._pointsProvider = value;
    this.onChange.emit(value);
  }

  public constructor(psProvider: PointsProvider, dependencies: CanvasElement[], color: Color = { r: 0, g: 0, b: 0 }, formula?: string, visible: boolean = true, public lineWidth: number = 3) {
    super(dependencies);
    this.configuration.formula = formula;
    this._color = color;
    this._visible = visible;
    this._pointsProvider = psProvider;
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    const iPoint = this.getClosestPointOnLineToPoint(p);
    if (iPoint !== undefined) {
      return getDistance(p, iPoint);
    }
    return undefined;
  }

  public getABCFormLine(): ABCFormLine | undefined {
    return getABCFormLineFromTwoPoints(this.point1, this.point2);
  }

  public getClosestPointOnLineToPoint(p: Point): Point | undefined {
    const abcThis = this.getABCFormLine();
    if (abcThis === undefined) {
      return undefined;
    }
    const abcOrthogonal = getOrthogonalToLineThroughPoint(abcThis, p);
    return getIntersectionPointLines(abcThis, abcOrthogonal);
  }
}

// Form: ax + by = c
export type ABCFormLine = {
  a: number,
  b: number,
  c: number
}

type PointsProvider = () => ([Point | undefined, Point | undefined]);
