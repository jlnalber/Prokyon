import AbstractLine, {ABCFormLine} from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {LineFormulaComponent} from "../../../formula-tab/line-formula/line-formula.component";
import {Type} from "@angular/core";
import {Point} from "../../interfaces/point";
import {areEqualPoints} from "../../essentials/utils";
import {colorAsTransparent} from "../../interfaces/color";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";

export default class LineElement extends AbstractLine {
  readonly componentType: Type<LineFormulaComponent> = LineFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const points = this.pointsProvider();
    const point1 = points[0];
    const point2 = points[1];

    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      const range = ctx.range;
      const abc = this.getABCFormLine() as ABCFormLine;
      let pS: Point;
      let pE: Point;

      // calculate the points where the line intersects the view port
      if (abc.a === 0) {
        pS = {
          x: range.x,
          y: abc.c / abc.b
        }
        pE = {
          x: range.x + range.width,
          y: abc.c / abc.b
        }
      }
      else {
        pS = {
          x: (abc.c - abc.b * range.y) / abc.a,
          y: range.y
        }
        pE = {
          x: (abc.c - abc.b * (range.y + range.height)) / abc.a,
          y: range.y + range.height
        }
      }

      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawPath([pS, pE], this.lineWidth * LINE_WIDTH_SELECTED_RATIO, colorAsTransparent(this._color, TRANSPARENCY_RATIO));
      }
      ctx.drawPath([pS, pE], this.lineWidth, this.color);
    }
  }

}
