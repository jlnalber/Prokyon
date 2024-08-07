import {Transformations} from "../interfaces/transformations";
import {Point} from "../interfaces/point";
import {Rect} from "../interfaces/rect";
import {BLACK, Color, getColorAsRgbaFunction, TRANSPARENT} from "../interfaces/color";
import {CanvasElement} from "./abstract/canvasElement";

const LINE_DASH = [10, 10]

export interface Config {
  showGrid?: boolean,
  gridColor?: Color,
  showNumbers?: boolean,
  drawPointsEqually?: boolean,
  drawNewLabels?: boolean,
  transformColor?: (c: Color) => Color
}

export class RenderingContext {
  constructor (private readonly ctx: CanvasRenderingContext2D,
               private readonly transformations: Transformations,
               private readonly _variables: any,
               public readonly selection: CanvasElement[],
               public readonly config?: Config) { }

  // TODO: Test when there is a resolution factor in the regular canvas
  public transformPointFromCanvasToField(p: Point): Point {
    return {
      x: p.x / this.transformations.zoom - this.transformations.translateX,
      y: -p.y / this.transformations.zoom - this.transformations.translateY
    }
  }

  public transformPointFromCanvasToFieldWithResolutionFactor(p: Point): Point {
    return this.transformPointFromCanvasToField({
      x: p.x / this.resolutionFactor,
      y: p.y / this.resolutionFactor
    });
  }

  public transformPointFromFieldToCanvas(p: Point): Point {
    return {
      x: (p.x + this.transformations.translateX) * this.transformations.zoom,
      y: -(p.y + this.transformations.translateY) * this.transformations.zoom
    }
  }

  public transformPointFromFieldToCanvasWithResolutionFactor(p: Point): Point {
    const q = this.transformPointFromFieldToCanvas(p);
    return {
      x: q.x * this.resolutionFactor,
      y: q.y * this.resolutionFactor
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

  public transformRectFromCanvasToFieldWithResolutionFactor(rect: Rect): Rect {
    return this.transformRectFromCanvasToField({
      x: rect.x / this.resolutionFactor,
      y: rect.y / this.resolutionFactor,
      width: rect.width / this.resolutionFactor,
      height: rect.height / this.resolutionFactor
    });
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

  public transformRectFromFieldToCanvasWithResolutionFactor(rect: Rect): Rect {
    let r = this.transformRectFromFieldToCanvas(rect);
    return {
      x: r.x * this.resolutionFactor,
      y: r.y * this.resolutionFactor,
      width: r.width * this.resolutionFactor,
      height: r.height * this.resolutionFactor
    }
  }

  public get zoom(): number {
    return this.transformations.zoom;
  }

  public get step(): number {
    return 1 / this.transformations.zoom;
  }

  public get range(): Rect {
    return this.transformRectFromCanvasToFieldWithResolutionFactor({
      x: 0,
      y: 0,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height
    })
  }

  public get resolutionFactor(): number {
    return this.transformations.resolutionFactor ?? 1;
  }

  public get lineDash(): number[] {
    const f = this.resolutionFactor;
    return LINE_DASH.map(i => i * f);
  }

  public get variables(): any {
    return { ... this._variables };
  }

  private getRightColor(c: Color): Color {
    if (this.config?.transformColor === undefined) return c;
    return this.config.transformColor(c);
  }

  public drawPath(points: Point[], lineWidth: number, stroke: Color, fill?: Color, dashed?: boolean): void {
    let realPoints = points.map(p => {
      return this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    });

    /*for (let p of realPoints) {
      this.ctx.fillStyle = getColorAsRgbaFunction(stroke);
      this.ctx.fillRect(p.x, p.y, lineWidth, lineWidth);
    }*/

    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth * this.resolutionFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

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

  public drawLine(from: Point, to: Point, lineWidth: number, stroke: Color, dashed?: boolean): void {
    this.drawPath([ from, to ], lineWidth, stroke, undefined, dashed);
  }

  public drawText(text: string, p: Point,
                  fontSize: number = 10,
                  fontFamily: string = 'sans-serif',
                  textAlign: CanvasTextAlign = 'start',
                  textBaseline: CanvasTextBaseline = 'alphabetic',
                  direction: CanvasDirection = 'inherit',
                  color: Color = { r: 0, g: 0, b: 0 },
                  stroke: Color = TRANSPARENT,
                  lineWidth: number = 3,
                  dashed?: boolean,
                  skipIndex?: boolean): void {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);
    const resFactor = this.resolutionFactor;

    // set the ctx up
    let ctx = this.ctx;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    // search for the underlined
    let strs: string[] = [];
    let lastStr = ''
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === '_' && i + 1 < text.length && !skipIndex) {
        strs.push(lastStr);
        lastStr = '';
        strs.push(text.charAt(i + 1));
        i++;
      } else {
        lastStr += text.charAt(i)
      }
    }
    if (lastStr !== '') {
      strs.push(lastStr);
    }

    // set global text properties
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.direction = direction;
    ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(color));
    ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    ctx.lineWidth = lineWidth * resFactor;

    const padding = 1;

    // write the undersets and the normal text
    let posX = realP.x;
    for (let i = 0; i < strs.length; i++) {
      const t = strs[i];
      let y = realP.y;

      if (i % 2 === 0) {
        ctx.font = `${fontSize * resFactor}px ${fontFamily}`;
      } else {
        ctx.font = `${3 * fontSize / 4 * resFactor}px ${fontFamily}`;
        y += fontSize / 3 * resFactor;
      }

      // draw the text
      ctx.strokeText(t, posX, y);
      ctx.fillText(t, posX, y);

      posX += ctx.measureText(t).width + padding;
    }
  }


  // TODO: skipping index
  public measureText(text: string,
                  fontSize: number = 10,
                  fontFamily: string = 'sans-serif',
                  textAlign: CanvasTextAlign = 'start',
                  textBaseline: CanvasTextBaseline = 'alphabetic',
                  direction: CanvasDirection = 'inherit',
                  lineWidth: number = 3): TextMetrics {
    // set the ctx up
    let ctx = this.ctx;

    ctx.font = `${fontSize}px ${fontFamily}`;
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
                     strokeWidth: number = 0,
                     dashed? : boolean): void {
    // draw an ellipse around the center point
    const resFactor = this.resolutionFactor;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.lineWidth = strokeWidth * resFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadiusX = radiusX * this.zoom * resFactor;
    const realRadiusY = radiusY * this.zoom * resFactor;

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
                    strokeWidth: number = 0,
                    dashed?: boolean): void {
    this.drawEllipse(center, radius, radius, 0, fill, stroke, strokeWidth, dashed);
  }

  public drawCircleSector(center: Point,
                    radius: number,
                    fill: Color = BLACK,
                    stroke: Color = TRANSPARENT,
                    strokeWidth: number = 0,
                    startAngle: number,
                    endAngle: number,
                    dashed?: boolean): void {
    // draw an ellipse around the center point
    const resFactor = this.resolutionFactor;

    this.ctx.lineWidth = strokeWidth * resFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realCenter = this.transformPointFromFieldToCanvasWithResolutionFactor(center)
    const realRadius = radius * this.zoom * resFactor;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.moveTo(realCenter.x, realCenter.y);
    this.ctx.arc(realCenter.x, realCenter.y, realRadius, startAngle, endAngle);
    this.ctx.lineTo(realCenter.x, realCenter.y);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  public drawRect(rect: Rect, fill: Color = BLACK, stroke: Color = TRANSPARENT, strokeWidth: number = 0, dashed?: boolean): void {
    const resFactor = this.resolutionFactor;

    if (dashed) {
      this.ctx.setLineDash(this.lineDash)
    } else {
      this.ctx.setLineDash([])
    }

    this.ctx.lineWidth = strokeWidth * resFactor;
    this.ctx.strokeStyle = getColorAsRgbaFunction(this.getRightColor(stroke));
    this.ctx.fillStyle = getColorAsRgbaFunction(this.getRightColor(fill));
    const realRect = this.transformRectFromFieldToCanvasWithResolutionFactor(rect);
    this.ctx.fillRect(realRect.x, realRect.y, realRect.width, realRect.height);
  }

  public drawImage(image: CanvasImageSource, p: Point, dw: number, dh: number) {
    let realP = this.transformPointFromFieldToCanvasWithResolutionFactor(p);

    // set the ctx up
    let ctx = this.ctx;
    const resFactor = this.resolutionFactor;

    ctx.drawImage(image, realP.x, realP.y, dw * resFactor, dh * resFactor)
  }
}
