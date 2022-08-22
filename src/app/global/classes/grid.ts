import {CanvasDrawer} from "./abstract/canvasDrawer";
import {RenderingContext} from "./renderingContext";
import {Color} from "../interfaces/color";
import {clamp} from "../essentials/utils";

export class Grid extends CanvasDrawer {
  override draw(ctx: RenderingContext) {
    if (ctx.config?.showGrid == undefined || ctx.config.showGrid) {
      // get metadata about the canvas
      const range = ctx.range;
      const ctxStep = ctx.step;
      const step = ctxStep * 99;

      // first, calculate the step width that is used to draw lines
      const base = ctx.config?.numbersBase ?? 2;
      const dim = Math.round(Math.log(step) / Math.log(base) + 0.5);
      let unit = Math.round(step / (base ** dim) + 0.5) * (base ** dim);
      if (unit == 0) return;

      // then, calculate data for the text rendering
      const drawText = ctx.config?.showNumbers ?? true;
      const offsetText = 15 * ctxStep;
      const yPos = clamp(range.y + range.height + offsetText, -offsetText, range.y - offsetText);
      const alignBottom = yPos == range.y + range.height + offsetText;
      const xPos = clamp(range.x + offsetText, -offsetText, range.x + range.width - offsetText);
      const alignLeft = xPos == range.x + offsetText;
      const font = '15px sans-serif';

      // then draw the lines
      const stroke: Color = ctx.config?.gridColor ?? {
        r: 100,
        g: 100,
        b: 100
      };
      // first parallel to the y-axis
      for (let x = range.x - range.x % unit; x < range.x + range.width; x += unit / base) {
        // draw line
        let big: boolean = x % unit == 0;
        ctx.drawLine({
          x: x,
          y: range.y
        }, {
          x: x,
          y: range.y + range.height
        }, x == 0 ? 3 : big ? 1 : 0.5, stroke);

        // draw arrow on axis
        if (x == 0) {
          const height = 15 * ctxStep;
          const offset = 0.5 * ctxStep;
          const offsetY = 3 * ctxStep;
          ctx.drawPath([{
            x: x + offset,
            y: range.y + offsetY
          }, {
            x: x - height / 4 + offset,
            y: range.y - height
          }, {
            x: x + height / 4 + offset,
            y: range.y - height
          }], 0, stroke, stroke);
        }
        // draw the text
        else if (big && drawText) {
          ctx.drawText(x.toLocaleString(), {
            x: x,
            y: yPos
          }, font, 'center', alignBottom ? 'bottom' : 'top');
        }
      }

      // then those parallel to the x-axis
      for (let y = (range.y + range.height) - (range.y + range.height) % unit; y < range.y; y += unit / base) {
        // draw line
        let big: boolean = y % unit == 0;
        ctx.drawLine({
          x: range.x,
          y: y
        }, {
          x: range.x + range.width,
          y: y
        }, y == 0 ? 3 : big ? 1 : 0.5, stroke);

        // draw arrow on axis
        if (y == 0) {
          const width = 15 * ctxStep;
          const offset = 0.5 * ctxStep;
          const offsetX = 3 * ctxStep;
          ctx.drawPath([{
            x: range.x + range.width + offsetX,
            y: y + offset
          }, {
            x: range.x + range.width - width,
            y: y - width / 4 + offset
          }, {
            x: range.x + range.width - width,
            y: y + width / 4 + offset
          }], 0, stroke, stroke);
        }
        // draw the text
        else if (big && drawText) {
          ctx.drawText(y.toLocaleString(), {
            x: xPos,
            y: y
          }, font, alignLeft ? 'left' : 'right', 'middle');
        }
      }

      // draw the 0 if in the range
      if (range.y >= -offsetText
        && range.y + range.height <= -offsetText
        && range.x <= -offsetText
        && range.x + range.width >= -offsetText
        && drawText) {
        ctx.drawText('0', {
          x: -offsetText,
          y: -offsetText
        }, font, 'right', 'top')
      }
    }
  }
}
