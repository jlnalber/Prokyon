import {CanvasElement} from "../abstract/canvasElement";
import {Color} from "../../interfaces/color";
import {Point} from "../../interfaces/point";

// a line of the form ax + by = c between two points
export default abstract class AbstractLine extends CanvasElement {
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

  public constructor(psProvider: PointsProvider, color: Color = { r: 0, g: 0, b: 0 }, visible: boolean = true, public lineWidth: number = 3) {
    super();
    this._color = color;
    this._visible = visible;
    this._pointsProvider = psProvider;
  }

  public getABCFormLine(): ABCFormLine | undefined {
    return AbstractLine.getABCFormLineFromTwoPoints(this.point1, this.point2);
  }

  public static getTwoPointsFromABCFormLine(abc: ABCFormLine | undefined): [Point, Point] | undefined {
    if (abc === undefined || (abc.a === 0 && abc.b === 0)) {
      return undefined;
    }
    else if (abc.a === 0) {
      return [{
        x: 0,
        y: abc.c / abc.b
      }, {
        x: 1,
        y: abc.c / abc.b
      }]
    }
    else {
      return [{
        x: abc.c / abc.a,
        y: 0
      }, {
        x: (abc.c - abc.b) / abc.a,
        y: 1
      }]
    }
  }

  public static getABCFormLineFromTwoPoints(point1: Point | undefined, point2: Point | undefined): ABCFormLine | undefined {
    if (point1 !== undefined && point2 !== undefined) {
      const a = point2.y - point1.y;
      const b = point1.x - point2.x;

      return {
        a,
        b,
        c: a * point1.x + b * point1.y
      }
    }

    return undefined;
  }
}

// Form: ax + by = c
export type ABCFormLine = {
  a: number,
  b: number,
  c: number
}

type PointsProvider = () => ([Point | undefined, Point | undefined]);
