import {Component} from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import DefiniteIntegral from "../../global/classes/canvas-elements/definiteIntegral";

@Component({
  selector: 'app-definite-integral-formula',
  templateUrl: './definite-integral-formula.component.html',
  styleUrls: ['./definite-integral-formula.component.css']
})
export class DefiniteIntegralFormulaComponent extends FormulaElement {

  public canvasElement!: DefiniteIntegral;

}
