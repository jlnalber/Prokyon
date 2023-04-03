import AbstractLine, {ABCFormLine} from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {LineFormulaComponent} from "../../../formula-tab/line-formula/line-formula.component";
import {Type} from "@angular/core";
import {Point} from "../../interfaces/point";
import {areEqualPoints, isIn} from "../../essentials/utils";
import {LineSegmentFormulaComponent} from "../../../formula-tab/line-segment-formula/line-segment-formula.component";

export default class LineSegmentElement extends AbstractLine {
  readonly componentType: Type<LineSegmentFormulaComponent> = LineSegmentFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const point1 = this.point1;
    const point2 = this.point2;
    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      ctx.drawPath([point1, point2], this.lineWidth, this.color);
    }
  }

}
