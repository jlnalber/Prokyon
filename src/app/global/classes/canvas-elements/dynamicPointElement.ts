import PointElement from "./pointElement";
import {Point} from "../../interfaces/point";
import {BLACK, Color} from "../../interfaces/color";
import DynamicElement from "./dynamicElement";
import {CanvasElement} from "../abstract/canvasElement";

export default class DynamicPointElement extends PointElement {
  private _pointProvider: PointProvider;

  public override get x(): number | undefined {
    return this._pointProvider()?.x
  }

  public override get y(): number | undefined {
    return this._pointProvider()?.y;
  }

  public get pointProvider(): PointProvider {
    return this._pointProvider;
  }

  public set pointProvider(value: PointProvider) {
    this._pointProvider = value;
    this.onChange.emit(value);
  }

  constructor(pointProvider: PointProvider, dependencies: CanvasElement[], color: Color = BLACK, name?: string, visible: boolean = true) {
    super({x: 0, y: 0}, color, true, dependencies, name, visible);
    this._pointProvider = pointProvider;
  }
}

type PointProvider = () => (Point | undefined);
