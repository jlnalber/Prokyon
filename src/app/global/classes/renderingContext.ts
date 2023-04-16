import {Transformations} from "../interfaces/transformations";
import {Point} from "../interfaces/point";
import {Rect} from "../interfaces/rect";
import {BLACK, Color, getColorAsRgbaFunction, RED, TRANSPARENT} from "../interfaces/color";
import {CanvasElement} from "./abstract/canvasElement";

export interface Config {
  showGrid?: boolean,
  gridColor?: Color,
  showNumbers?: boolean,
  transformColor?: (c: Color) => Color
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

  public get zoom(): number {
    return this.transformations.zoom;
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

  private getRightColor(c: Color): Color {
    if (this.config?.transformColor === undefined) return c;
    return this.config.transformColor(c);
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
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));

    if (realPoints.length != 0) {
      let firstP = realPoints[0];
      this.ctx.moveTo(firstP.x, firstP.y);

      for (let i = 1; i < realPoints.length; i++) {
        let p = realPoints[i];
        this.ctx.lineTo(p.x, p.y);
      }

      this.ctx.stroke();

      if (fill) {
        this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
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
                  stroke: Color = TRANSPARENT,
                  lineWidth: number = 3,
                  maxWidth?: number): void {
    let realP = this.transformPointFromFieldToCanvas(p);

    // set the ctx up
    let ctx = this.ctx;

    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.direction = direction;
    ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(color));
    ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    ctx.lineWidth = lineWidth;

    // draw the text
    ctx.strokeText(text, realP.x, realP.y, maxWidth);
    ctx.fillText(text, realP.x, realP.y, maxWidth);
  }

  public measureText(text: string,
                  font: string = '10px sans-serif',
                  textAlign: CanvasTextAlign = 'start',
                  textBaseline: CanvasTextBaseline = 'alphabetic',
                  direction: CanvasDirection = 'inherit',
                  lineWidth: number = 3): TextMetrics {
    // set the ctx up
    let ctx = this.ctx;

    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.direction = direction;
    ctx.lineWidth = lineWidth;

    // draw the text
    return ctx.measureText(text);
  }

  public drawEllipse(center: Point,
                     radiusX: number,
                     radiusY: number,
                     rotation: number,
                     fill: Color = BLACK,
                     stroke: Color = TRANSPARENT,
                     strokeWidth: number = 0): void {
    // draw an ellipse around the center point
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realCenter = this.transformPointFromFieldToCanvas(center)
    const realRadiusX = radiusX * this.zoom;
    const realRadiusY = radiusY * this.zoom;

    this.ctx.beginPath();
    this.ctx.ellipse(realCenter.x, realCenter.y, realRadiusX, realRadiusY, rotation, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawCircle(center: Point,
                    radius: number,
                    fill: Color = BLACK,
                    stroke: Color = TRANSPARENT,
                    strokeWidth: number = 0): void {
    this.drawEllipse(center, radius, radius, 0, fill, stroke, strokeWidth);
  }

  public drawRect(rect: Rect, fill: Color = BLACK, stroke: Color = TRANSPARENT, strokeWidth: number = 0): void {
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realRect = this.transformRectFromFieldToCanvas(rect);
    this.ctx.fillRect(realRect.x, realRect.y, realRect.width, realRect.height);
  }
}
