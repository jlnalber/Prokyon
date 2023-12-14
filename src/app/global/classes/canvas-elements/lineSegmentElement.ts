import AbstractLine, {PointsProvider} from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {areEqualPoints, isInRange} from "../../essentials/utils";
import {Color, colorAsTransparent} from "../../interfaces/color";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";
import {Point} from "../../interfaces/point";
import {getDistance} from "../../essentials/utils";
import {GeometricFormulaComponent} from "../../../formula-tab/geometric-formula/geometric-formula.component";
import {CanvasElement} from "../abstract/canvasElement";
import {CanvasElementSerialized} from "../../essentials/serializer";
import PointElement from "./pointElement";
import {getMiddlePointByPoints} from "../../essentials/geometryUtils";

type Data = {
  p1: number,
  p2: number
}

export default class LineSegmentElement extends AbstractLine {
  readonly componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const point1 = this.point1;
    const point2 = this.point2;

    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawPath([point1, point2], this.lineWidth * LINE_WIDTH_SELECTED_RATIO, colorAsTransparent(this._color, TRANSPARENCY_RATIO), undefined, this.configuration.dashed)
      }
      ctx.drawPath([point1, point2], this.lineWidth, this.color, undefined, this.configuration.dashed);
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    const iPoint = this.getClosestPointOnLineToPoint(p);
    const point1 = this.point1;
    const point2 = this.point2;
    if (iPoint !== undefined && point1 !== undefined && point2 !== undefined) {
      if (isInRange(iPoint.x,  point1.x, point2.x) && isInRange(iPoint.y, point1.y, point2.y)) {
        return getDistance(p, iPoint);
      }
      else {
        return Math.min(getDistance(point1, iPoint), getDistance(point2, iPoint))
      }
    }
    return undefined;
  }

  public override getPositionForLabel(rtx: RenderingContext): Point | undefined {
    const zoom = rtx.zoom;
    const depos = 15;

    const middlePoint = getMiddlePointByPoints(this.point1, this.point2);
    if (middlePoint === undefined) {
      return undefined;
    }

    return {
      x: middlePoint.x + depos / zoom,
      y: middlePoint.y + depos / zoom
    }
  }

  constructor(psProvider: PointsProvider,
              dependencies: CanvasElement[],
              protected dataProvider: () => Data,
              color: Color = { r: 0, g: 0, b: 0 },
              formula?: string,
              visible: boolean = true,
              lineWidth: number = 3,
              showLabel: boolean = true) {
    super(psProvider, dependencies, color, formula, visible, lineWidth, showLabel);
  }

  public static getDefaultInstance(): LineSegmentElement {
    return new LineSegmentElement(() => [undefined, undefined], [], () => {
      return {
        p1: -1,
        p2: -1
      }
    })
  }

  public override serialize(): CanvasElementSerialized {
    return {
      data: this.dataProvider(),
      style: {
        color: this.color,
        visible: this.visible,
        size: this.lineWidth
      }
    }
  }

  public override loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized) {
    this.color = canvasElementSerialized.style.color;
    this.visible = canvasElementSerialized.style.visible;
    this.lineWidth = canvasElementSerialized.style.size ?? this.lineWidth;

    const data: Data = canvasElementSerialized.data as Data;
    const p1 = canvasElements[data.p1];
    const p2 = canvasElements[data.p2];

    if (p1 instanceof PointElement && p2 instanceof PointElement) {
      this.pointsProvider = () => [p1.point, p2.point];
      this.dataProvider = () => {
        return {
          p1: p1.id,
          p2: p2.id
        }
      }

      this.addDependency(p1, p2);
    }
  }

}
