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
import {
  ViewAbstractLineElementComponent
} from "../../../formula-dialogs/view-abstract-line-element/view-abstract-line-element.component";

// a line of the form ax + by = c between two points
export default abstract class AbstractLine extends DynamicElement {
  public override formulaDialogType = ViewAbstractLineElementComponent;

  private _pointsProvider: PointsProvider;

  private _tempPoints: [(Point | undefined), (Point | undefined)] | undefined;

  public get point1(): Point | undefined {
    if (this._tempPoints === undefined) {
      this._tempPoints = this._pointsProvider();
    }
    return this._tempPoints[0];
  }

  public get point2(): Point | undefined {
    if (this._tempPoints == undefined) {
      this._tempPoints = this._pointsProvider();
    }
    return this._tempPoints[1];
  }

  public get pointsProvider(): PointsProvider {
    return this._pointsProvider;
  }

  public set pointsProvider(value: PointsProvider) {
    this._pointsProvider = value;
    this.onChange.emit(value);
  }

  protected constructor(psProvider: PointsProvider,
                     dependencies: CanvasElement[],
                     color: Color = { r: 0, g: 0, b: 0 },
                     formula?: string,
                     visible: boolean = true,
                     public lineWidth: number = 3,
                     showLabel: boolean = true) {
    super(dependencies);
    this.configuration.formula = formula;
    this.configuration.showLabel = showLabel;
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

  protected override resetTempListener = () => {
    this._tempPoints = undefined;
  }
}

// Form: ax + by = c
export type ABCFormLine = {
  a: number,
  b: number,
  c: number
}

export type PointsProvider = () => ([Point | undefined, Point | undefined]);
