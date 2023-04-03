import {CanvasElement} from "../abstract/canvasElement";
import {Color} from "../../interfaces/color";
import {Point} from "../../interfaces/point";

// a line of the form ax + by = c between two points
export default abstract class AbstractLine extends CanvasElement {
  private _point1Provider: PointProvider;

  public get point1(): Point | undefined {
    return this._point1Provider();
  }

  public get point1Provider(): PointProvider {
    return this._point1Provider;
  }

  public set point1Provider(value: PointProvider) {
    this._point1Provider = value;
    this.onChange.emit(value);
  }


  private _point2Provider: PointProvider;

  public get point2(): Point | undefined {
    return this._point2Provider();
  }

  public get point2Provider(): PointProvider {
    return this._point2Provider;
  }

  public set point2Provider(value: PointProvider) {
    this._point2Provider = value;
    this.onChange.emit(value);
  }

  public constructor(p1Provider: PointProvider, p2Provider: PointProvider, color: Color = { r: 0, g: 0, b: 0 }, visible: boolean = true, public lineWidth: number = 3) {
    super();
    this._color = color;
    this._visible = visible;
    this._point1Provider = p1Provider;
    this._point2Provider = p2Provider;
  }

  public getABCFormLine(): ABCFormLine | undefined {
    const point1 = this.point1;
    const point2 = this.point2;
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

type PointProvider = () => Point | undefined;
