import AbstractLine from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {areEqualPoints} from "../../essentials/utils";
import {LineSegmentFormulaComponent} from "../../../formula-tab/line-segment-formula/line-segment-formula.component";

export default class LineSegmentElement extends AbstractLine {
  readonly componentType: Type<LineSegmentFormulaComponent> = LineSegmentFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const points = this.pointsProvider();
    const point1 = points[0];
    const point2 = points[1];
    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      ctx.drawPath([point1, point2], this.lineWidth, this.color);
    }
  }

}
