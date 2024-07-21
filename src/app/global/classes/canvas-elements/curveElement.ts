import {CanvasElement} from "../abstract/canvasElement";
import {Type} from "@angular/core";
import {FormulaElement} from "../abstract/formulaElement";
import FormulaDialogElement from "../abstract/formulaDialogElement";
import {CanvasElementSerialized} from "../../essentials/serializer";
import {DrawerService} from "../../../services/drawer.service";
import {CurveFormulaComponent} from "../../../formula-tab/curve-formula/curve-formula.component";
import {RenderingContext} from "../renderingContext";
import {Point} from "../../interfaces/point";
import {Operation} from "../func/operations/operation";
import {BLACK, Color, colorAsTransparent} from "../../interfaces/color";
import {getDistance} from "../../essentials/utils";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";
import {ViewCurveElementComponent} from "../../../formula-dialogs/view-curve-element/view-curve-element.component";

type Data = {
  parameter: string,
  topText: string,
  bottomText: string,
  steps: number,
  xText: string,
  yText: string
}

export type ParseAndValidateProvider = (str: string, vars: string[]) => Operation | string;

export default class CurveElement extends CanvasElement {

  readonly componentType: Type<FormulaElement> = CurveFormulaComponent;
  readonly formulaDialogType: Type<FormulaDialogElement> | undefined = ViewCurveElementComponent;

  constructor(private readonly parseAndValidateProvider: ParseAndValidateProvider,
              color: Color = BLACK,
              lineWidth: number = 3,
              name?: string,
              visible: boolean = true,
              showLabel: boolean = true) {
    super();
    this._color = color;
    this._lineWidth = lineWidth;
    this.configuration.name = name;
    this.configuration.showLabel = showLabel;
    this.svgLabel = undefined;
    this._visible = visible;
  }

  private _lineWidth: number;
  public get lineWidth(): number {
    return this._lineWidth;
  }
  public set lineWidth(value: number) {
    this._lineWidth = value;
    this.onChange.emit(value);
  }

  public get dashed(): boolean {
    return this.configuration.dashed == true;
  }
  public set dashed(value: boolean) {
    this.configuration.dashed = value;
    this.onChange.emit(value);
  }

  private _parameter: string = 't';
  private _steps: number = 1000;

  private _xText: string = '0';
  private _xErrorText: string | undefined;
  private _xOperation: Operation | undefined;

  private _yText: string = '0';
  private _yErrorText: string | undefined;
  private _yOperation: Operation | undefined;

  private _bottomText: string = '0';
  private _bottomErrorText: string | undefined;
  private _bottomOperation: Operation | undefined;

  private _topText: string = '1';
  private _topErrorText: string | undefined;
  private _topOperation: Operation | undefined;

  public get parameter(): string {
    return this._parameter;
  }
  public set parameter(value: string) {
    this._parameter = value;
    this.onChange.emit(value);
  }

  public get steps(): number {
    return this._steps;
  }
  public set steps(value: number) {
    this._steps = Math.floor(Math.abs(value));
    this.onChange.emit(value);
  }

  public get xText(): string {
    return this._xText;
  }
  public set xText(value: string) {
    this._xText = value;
    this.reparseX();
    this.onChange.emit(value);
  }
  public get xError(): boolean {
    return this._xErrorText !== undefined;
  }
  public get xErrorText(): string | undefined {
    return this._xErrorText;
  }
  public get xOperation(): Operation | undefined {
    return this._xOperation;
  }

  public get yText(): string {
    return this._yText;
  }
  public set yText(value: string) {
    this._yText = value;
    this.reparseY();
    this.onChange.emit(value);
  }
  public get yError(): boolean {
    return this._yErrorText !== undefined;
  }
  public get yErrorText(): string | undefined {
    return this._yErrorText;
  }
  public get yOperation(): Operation | undefined {
    return this._yOperation;
  }

  public get bottomText(): string {
    return this._bottomText;
  }
  public set bottomText(value: string) {
    this._bottomText = value;
    this.reparseBottom();
    this.onChange.emit(value);
  }
  public get bottomError(): boolean {
    return this._bottomErrorText !== undefined;
  }
  public get bottomErrorText(): string | undefined {
    return this._bottomErrorText;
  }
  public get bottomOperation(): Operation | undefined {
    return this._bottomOperation;
  }

  public get topText(): string {
    return this._topText;
  }
  public set topText(value: string) {
    this._topText = value;
    this.reparseTop();
    this.onChange.emit(value);
  }
  public get topError(): boolean {
    return this._topErrorText !== undefined;
  }
  public get topErrorText(): string | undefined {
    return this._topErrorText;
  }
  public get topOperation(): Operation | undefined {
    return this._topOperation;
  }

  public get error(): boolean {
    return this.topError || this.bottomError || this.yError || this.xError;
  }

  public reparseX(): boolean {
    const res = this.parseAndValidateProvider(this._xText, [this.parameter]);
    if (res instanceof Operation) {
      this._xOperation = res;
      this._xErrorText = undefined;
      return true;
    }
    else {
      this._xOperation = undefined;
      this._xErrorText = res;
      return false;
    }
  }

  public reparseY(): boolean {
    const res = this.parseAndValidateProvider(this._yText, [this.parameter]);
    if (res instanceof Operation) {
      this._yOperation = res;
      this._yErrorText = undefined;
      return true;
    }
    else {
      this._yOperation = undefined;
      this._yErrorText = res;
      return false;
    }
  }

  public reparseBottom(): boolean {
    const res = this.parseAndValidateProvider(this._bottomText, []);
    if (res instanceof Operation) {
      this._bottomOperation = res;
      this._bottomErrorText = undefined;
      return true;
    }
    else {
      this._bottomOperation = undefined;
      this._bottomErrorText = res;
      return false;
    }
  }

  public reparseTop(): boolean {
    const res = this.parseAndValidateProvider(this._topText, []);
    if (res instanceof Operation) {
      this._topOperation = res;
      this._topErrorText = undefined;
      return true;
    }
    else {
      this._topOperation = undefined;
      this._topErrorText = res;
      return false;
    }
  }

  public reparse(): boolean {
    const x = this.reparseX();
    const y = this.reparseY();
    const bottom = this.reparseBottom();
    const top = this.reparseTop();
    return x && y && bottom && top;
  }

  public parseIfNecessary(): void {
    // parse the operations
    if (this.bottomOperation === undefined) {
      this.reparseBottom();
    }
    if (this.topOperation === undefined) {
      this.reparseTop();
    }
    if (this.xOperation === undefined) {
      this.reparseX();
    }
    if (this.yOperation === undefined) {
      this.reparseY();
    }
  }


  draw(ctx: RenderingContext): void {
    const points = this.getPoints(ctx);

    if (points !== undefined) {
      const colorSelected = colorAsTransparent(this._color, TRANSPARENCY_RATIO);
      const lineWidthSelected = this.lineWidth * LINE_WIDTH_SELECTED_RATIO;

      // draw the curve
      ctx.drawPath(points, this.lineWidth, this.color, undefined, this.dashed);
      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawPath(points, lineWidthSelected, colorSelected, undefined, this.dashed);
      }
    }
  }

  private getPoints(ctx: RenderingContext): Point[] | undefined {
    // get all the points
    this.parseIfNecessary();

    if (!this.error && this.bottomOperation !== undefined && this.topOperation !== undefined && this.xOperation !== undefined && this.yOperation !== undefined) {
      // get all the important data
      const variables = ctx.variables;
      let bottom = this.bottomOperation.evaluate(variables);
      let top = this.topOperation.evaluate(variables);
      if (top < bottom) {
        const temp = bottom;
        bottom = top;
        top = temp;
      }

      // collect all the points
      const points: Point[] = [];
      const steps = this.steps;
      const stepLength = (top - bottom) / steps;
      for (let i = 0; i <= steps; i++) {
        const t = bottom + stepLength * i;

        try {
          variables[this.parameter] = t;
          const x = this.xOperation.evaluate(variables);
          const y = this.yOperation.evaluate(variables);
          points.push({
            x, y
          })
        } catch {
        }
      }

      return points;
    }

    return undefined;
  }

  loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void {
    const data: Data = canvasElementSerialized.data as Data;

    this._xText = data.xText;
    this._yText = data.yText;
    this._bottomText = data.bottomText;
    this._topText = data.topText;
    this._parameter = data.parameter;
    this._steps = data.steps;

    this._color = canvasElementSerialized.style.color;
    this._lineWidth = canvasElementSerialized.style.size ?? 3;
    this._visible = canvasElementSerialized.style.visible;

    this.onChange.emit();
  }

  serialize(): CanvasElementSerialized {
    const data: Data = {
      xText: this.xText,
      yText: this.yText,
      parameter: this.parameter,
      bottomText: this.bottomText,
      topText: this.topText,
      steps: this.steps
    }

    return {
      data,
      style: {
        color: this.color,
        size: this.lineWidth,
        visible: this.visible,
      }
    }
  }

  public static getDefaultInstance(drawerService: DrawerService): CurveElement {
    return new CurveElement((t: string, vars: string[]) => drawerService.parseAndValidateOperation(t, true, vars));
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    const points = this.getPoints(ctx);

    if (points === undefined) {
      return undefined;
    }

    const dists = points.map(point => getDistance(point, p))

    if (dists.length === 0) {
      return undefined;
    }

    let min = dists[0];
    for (let i = 1; i < dists.length; i++) {
      if (dists[i] < min) {
        min = dists[i];
      }
    }
    return min;
  }

  public override getPositionForLabel(rtx: RenderingContext): Point | undefined {
    const depos = 15;

    // get the middle point
    this.parseIfNecessary();

    if (!this.error && this.bottomOperation !== undefined && this.topOperation !== undefined && this.xOperation !== undefined && this.yOperation !== undefined) {
      // get all the important data
      const variables = rtx.variables;
      let bottom = this.bottomOperation.evaluate(variables);
      let top = this.topOperation.evaluate(variables);

      variables[this.parameter] = (bottom + top) / 2;

      try {
        const x = this.xOperation.evaluate(variables);
        const y = this.yOperation.evaluate(variables);

        return {
          x: x + depos / rtx.zoom,
          y: y + depos / rtx.zoom
        }
      }
      catch { }
    }

    return undefined;
  }

  public clone(): CurveElement {
    const c = new CurveElement(this.parseAndValidateProvider, this.color, this.lineWidth, undefined, this.visible);
    c._steps = this._steps;
    c._parameter = this._parameter;
    c._xText = this._xText;
    c._yText = this._yText;
    c._bottomText = this._bottomText;
    c._topText = this._topText;
    c.configuration = { ...this.configuration };

    return c;
  }

}

