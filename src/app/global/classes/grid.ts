import {CanvasDrawer} from "./abstract/canvasDrawer";
import {RenderingContext} from "./renderingContext";
import {Color} from "../interfaces/color";
import {clamp, correctRect} from "../essentials/utils";

export class Grid extends CanvasDrawer {
  public override draw(ctx: RenderingContext) {
    if (ctx.config?.showGrid === undefined || ctx.config.showGrid) {
      // get metadata about the canvas
      const range = correctRect(ctx.range);
      const step = 99 / ctx.zoom;

      // first, calculate the step width that is used to draw lines
      const base = 2;
      const dim = Math.round(Math.log(step) / Math.log(base) + 0.5);
      let unit = Math.round(step / (base ** dim) + 0.5) * (base ** dim);
      if (unit == 0) return;

      // then, calculate data for the text rendering
      const drawText = ctx.config?.showNumbers ?? true;
      const offsetText = 15 / ctx.zoom;
      const yPos = clamp(range.y + offsetText, -offsetText, range.y + range.height - offsetText);
      const alignBottom = yPos == range.y + offsetText;
      const xPos = clamp(range.x + offsetText, -offsetText, range.x + range.width - offsetText);
      const alignLeft = xPos == range.x + offsetText;
      const fontSize = 15;
      const fontFamily = 'sans-serif';

      // then, draw the lines
      const stroke: Color = ctx.config?.gridColor ?? {
        r: 100,
        g: 100,
        b: 100
      };
      // first, parallel to the y-axis
      for (let x = range.x - range.x % (unit / base); x < range.x + range.width; x += unit / base) {
        // draw line
        let big: boolean = x % unit === 0;
        ctx.drawLine({
          x: x,
          y: range.y
        }, {
          x: x,
          y: range.y + range.height
        }, x === 0 ? 3 : big ? 1 : 0.5, stroke);

        // draw arrow on axis
        if (x === 0) {
          const height = 15 / ctx.zoom;
          const offset = 0.5 / ctx.zoom;
          const offsetY = 3 / ctx.zoom;
          ctx.drawPath([{
            x: x + offset,
            y: range.y + range.height + offsetY
          }, {
            x: x - height / 4 + offset,
            y: range.y + range.height - height
          }, {
            x: x + height / 4 + offset,
            y: range.y + range.height - height
          }], 0, stroke, stroke);
        }
        // draw the text
        else if (big && drawText) {
          ctx.drawText(x.toLocaleString(), {
            x: x,
            y: yPos
          }, fontSize, fontFamily, 'center', alignBottom ? 'bottom' : 'top');
        }
      }

      // then, those parallel to the x-axis
      for (let y = range.y - range.y % (unit / base); y < range.y + range.height; y += unit / base) {
        // draw line
        let big: boolean = y % unit === 0;
        ctx.drawLine({
          x: range.x,
          y: y
        }, {
          x: range.x + range.width,
          y: y
        }, y === 0 ? 3 : big ? 1 : 0.5, stroke);

        // draw arrow on axis
        if (y === 0) {
          const width = 15 / ctx.zoom;
          const offset = 0.5 / ctx.zoom;
          const offsetX = 3 / ctx.zoom;
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
          }, fontSize, fontFamily, alignLeft ? 'left' : 'right', 'middle');
        }
      }

      // draw the 0 if in the range
      if (range.y <= -offsetText
        && range.y + range.height >= -offsetText
        && range.x <= -offsetText
        && range.x + range.width >= -offsetText
        && drawText) {
        ctx.drawText('0', {
          x: -offsetText,
          y: -offsetText
        }, fontSize, fontFamily, 'right', 'top')
      }
    }
  }
}
