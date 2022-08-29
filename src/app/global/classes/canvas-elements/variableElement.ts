import {CanvasElement} from "../abstract/canvasElement";
import {FormulaElement} from "../abstract/formulaElement";
import {Type} from "@angular/core";
import {VariableFormulaComponent} from "../../../formula-tab/variable-formula/variable-formula.component";

export default class VariableElement extends CanvasElement {
  public readonly componentType: Type<FormulaElement> = VariableFormulaComponent;

  public override draw(): void {
    return;
  }

  constructor(key: string, value: number) {
    super();
    this._key = key;
    this._value = value;
  }

  private _value: number;
  public get value(): number {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
    this.onChange.emit(value);
  }

  private _key: string;
  public get key(): string {
    return this._key;
  }
  public set key(value: string) {
    this._key = value;
    this.onChange.emit(value);
  }
}
