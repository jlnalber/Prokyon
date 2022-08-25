import {Transformations} from "../interfaces/transformations";
import {Point} from "../interfaces/point";
import {Rect} from "../interfaces/rect";
import {Color, getColorAsRgbaFunction} from "../interfaces/color";
import {CanvasElement} from "./abstract/canvasElement";

export interface Config {
  showGrid?: boolean,
  gridColor?: Color,
  showNumbers?: boolean,
  numbersBase?: number
}

export class RenderingContext {
  constructor (private readonly ctx: CanvasRenderingContext2D,
               private readonly transformations: Transformations,
               public readonly variables: any,
               public readonly selection: CanvasElement[],
               public readonly config?: Config) { }

  public transformPointFromCanvasToField(p: Point): Point {
    return {
      x: p.x / this.transformations.zoom - this.transformations.translateX,
      y: -p.y / this.transformations.zoom - this.transformations.translateY
    }
  }

  public transformPointFromFieldToCanvas(p: Point): Point {
    return {
      x: (p.x + this.transformations.translateX) * this.transformations.zoom,
      y: -(p.y + this.transformations.translateY) * this.transformations.zoom
    }
  }

  public transformRectFromCanvasToField(rect: Rect): Rect {
    let p = this.transformPointFromCanvasToField(rect);
    return {
      x: p.x,
      y: p.y,
      width: rect.width / this.transformations.zoom,
      height: -rect.height / this.transformations.zoom
    }
  }

  public transformRectFromFieldToCanvas(rect: Rect): Rect {
    let p = this.transformPointFromFieldToCanvas(rect);
    return {
      x: p.x,
      y: p.y,
      width: rect.width * this.transformations.zoom,
      height: -rect.height * this.transformations.zoom
    }
  }

  public get step(): number {
    return 1 / this.transformations.zoom;
  }

  public get range(): Rect {
    return this.transformRectFromCanvasToField({
      x: 0,
      y: 0,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height
    })
  }

  public drawPath(points: Point[], lineWidth: number, stroke: Color, fill?: Color): void {
    let realPoints = points.map(p => {
      return this.transformPointFromFieldToCanvas(p);
    });

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/

    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = getColorAsRgbaFunction(stroke);

    if (realPoints.length != 0) {
      let firstP = realPoints[0];
      this.ctx.moveTo(firstP.x, firstP.y);

      for (let i = 1; i < realPoints.length; i++) {
        let p = realPoints[i];
        this.ctx.lineTo(p.x, p.y);
      }

      this.ctx.stroke();

      if (fill) {
        this.ctx.fillStyle = getColorAsRgbaFunction(fill);
        this.ctx.fill();
      }

      this.ctx.closePath();
    }
  }

  public drawLine(from: Point, to: Point, lineWidth: number, stroke: Color): void {
    this.drawPath([ from, to ], lineWidth, stroke);
  }

  public drawText(text: string, p: Point,
                  font: string = '10px sans-serif',
                  textAlign: CanvasTextAlign = 'start',
                  textBaseline: CanvasTextBaseline = 'alphabetic',
                  direction: CanvasDirection = 'inherit',
                  color: Color = { r: 0, g: 0, b: 0 },
                  maxWidth?: number): void {
    let realP = this.transformPointFromFieldToCanvas(p);

    // set the ctx up
    let ctx = this.ctx;
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.direction = direction;
    ctx.fillStyle = getColorAsRgbaFunction(color);

    // draw the text
    ctx.fillText(text, realP.x, realP.y, maxWidth);
  }
}
