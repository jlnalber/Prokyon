import DynamicPointElement from "./dynamicPointElement";
import {Operation} from "../func/operations/operation";
import {Point} from "../../interfaces/point";
import {BLACK, Color} from "../../interfaces/color";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {FormulaElement} from "../abstract/formulaElement";
import {
  CompiledPointFormulaComponent
} from "../../../formula-tab/compiled-point-formula/compiled-point-formula.component";
import {CanvasElementSerialized} from "../../essentials/serializer";
import {CanvasElement} from "../abstract/canvasElement";
import {DrawerService} from "../../../services/drawer.service";

export type ParseAndValidateProvider = (str: string) => Operation | string;

type Data = {
  xText: string,
  yText: string
}

export default class CompiledPointElement extends DynamicPointElement {


  public override readonly componentType: Type<FormulaElement> = CompiledPointFormulaComponent;

  constructor(private readonly parseAndValidateProvider: ParseAndValidateProvider,
              color: Color = BLACK,
              name?: string,
              visible: boolean = true) {
    super(null!, [], null!, color, name, visible);
    this._pointProvider = this.evaluate;
  }

  private _xText: string = "0";
  private _xOperation: Operation | undefined;
  private _xErrorText: string | undefined;
  private _yText: string = "0";
  private _yOperation: Operation | undefined;
  private _yErrorText: string | undefined;

  public get xText(): string {
    return this._xText;
  }
  public set xText(value: string) {
    this._xText = value;
    this.reparseX();
    this.onChange.emit(value);
  }

  public get yText(): string {
    return this._yText;
  }
  public set yText(value: string) {
    this._yText = value;
    this.reparseY();
    this.onChange.emit(value);
  }

  public get xErrorText(): string | undefined {
    return this._xErrorText;
  }
  public get xError(): boolean {
    return this._xErrorText !== undefined;
  }
  public get yErrorText(): string | undefined {
    return this._yErrorText;
  }
  public get yError(): boolean {
    return this._yErrorText !== undefined;
  }
  public get error(): boolean {
    return this.yError || this.xError;
  }

  public get xOperation(): Operation | undefined {
    return this._xOperation;
  }
  public get yOperation(): Operation | undefined {
    return this._yOperation;
  }

  public reparseX(): boolean {
    const res = this.parseAndValidateProvider(this._xText);
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
    const res = this.parseAndValidateProvider(this._yText);
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

  public reparse(): boolean {
    const x = this.reparseX();
    const y = this.reparseY();
    return x && y;
  }

  private _tempVariables: any;
  public evaluate: () => Point | undefined = () => {
    if (this.error || this._xOperation === undefined || this._yOperation === undefined) {
      this.reparse();
    }
    if (this.error || this._xOperation === undefined || this._yOperation === undefined) {
      return undefined;
    }

    try {
      const x = this._xOperation.evaluate(this._tempVariables);
      const y = this._yOperation.evaluate(this._tempVariables);
      return {
        x, y
      }
    }
    catch {
      return undefined;
    }
  }

  public override serialize(): CanvasElementSerialized {
    const data: Data = {
      xText: this.xText,
      yText: this.yText
    }

    return {
      data,
      style: {
        color: this.color,
        size: this.radius,
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        visible: this.visible
      }
    };
  }

  public override loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService) {
    const data: Data = canvasElementSerialized.data as Data;

    this.loadStyle(canvasElementSerialized.style);

    this._xText = data.xText;
    this._yText = data.yText;
  }


  public static override getDefaultInstance(): CompiledPointElement {
    return new CompiledPointElement(() => undefined!)
  }

  public static getDefaultInstanceWithDrawerService(drawerService: DrawerService): CompiledPointElement {
    return new CompiledPointElement((t: string) => drawerService.parseAndValidateOperation(t))
  }



  public override draw(ctx: RenderingContext) {
    //this._tempVariables = ctx.variables ?? {};
    super.draw(ctx);
  }

  protected override resetTempListener = (ctx?: RenderingContext) => {
    this._tempPoint = undefined;
    if (ctx !== undefined) {
      this._tempVariables = ctx.variables ?? {};
    }
  }

}
