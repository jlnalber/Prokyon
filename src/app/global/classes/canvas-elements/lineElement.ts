import AbstractLine, {ABCFormLine} from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {LineFormulaComponent} from "../../../formula-tab/line-formula/line-formula.component";
import {Type} from "@angular/core";
import {Point} from "../../interfaces/point";
import {areEqualPoints} from "../../essentials/utils";

export default class LineElement extends AbstractLine {
  readonly componentType: Type<LineFormulaComponent> = LineFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const point1 = this.point1;
    const point2 = this.point2;
    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      const range = ctx.range;
      const abc = this.getABCFormLine() as ABCFormLine;
      let pS: Point = {x: 0, y: 0};
      let pE: Point = {x: 0, y: 0};

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

      ctx.drawPath([pS, pE], this.lineWidth, this.color);
    }
  }

}
