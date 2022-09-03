import {Component} from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import DefiniteIntegral from "../../global/classes/canvas-elements/definiteIntegral";
import {Color, colorAsTransparent} from "../../global/interfaces/color";

@Component({
  selector: 'app-definite-integral-formula',
  templateUrl: './definite-integral-formula.component.html',
  styleUrls: ['./definite-integral-formula.component.css']
})
export class DefiniteIntegralFormulaComponent extends FormulaElement {

  private _canvasElement!: DefiniteIntegral;
  public get canvasElement(): DefiniteIntegral {
    return this._canvasElement;
  }
  public set canvasElement(value: DefiniteIntegral) {
    this._canvasElement = value;
    this.color = this.canvasElement.color;
  }

  private _color!: Color;
  public get color(): Color {
    return this._color;
  }
  public set color(value: Color) {
    this._color = value;
    this.canvasElement.color = colorAsTransparent(value, 0.3);
  }

}
