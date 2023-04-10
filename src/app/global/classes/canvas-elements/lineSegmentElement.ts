import AbstractLine from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {areEqualPoints, isInRange} from "../../essentials/utils";
import {colorAsTransparent} from "../../interfaces/color";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";
import {Point} from "../../interfaces/point";
import {getDistance} from "../../essentials/utils";
import {GeometricFormulaComponent} from "../../../formula-tab/geometric-formula/geometric-formula.component";

export default class LineSegmentElement extends AbstractLine {
  readonly componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const points = this.pointsProvider();
    const point1 = points[0];
    const point2 = points[1];

    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawPath([point1, point2], this.lineWidth * LINE_WIDTH_SELECTED_RATIO, colorAsTransparent(this._color, TRANSPARENCY_RATIO))
      }
      ctx.drawPath([point1, point2], this.lineWidth, this.color);
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

}
