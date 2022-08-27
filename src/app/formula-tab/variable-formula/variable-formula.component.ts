import { Component, OnInit } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import VariableElement from "../../global/classes/canvas-elements/variableElement";

@Component({
  selector: 'app-variable-formula',
  templateUrl: './variable-formula.component.html',
  styleUrls: ['./variable-formula.component.css']
})
export class VariableFormulaComponent extends FormulaElement implements OnInit {

  constructor() {
    super();
    this._canvasElement = new VariableElement('', 0);
  }

  ngOnInit(): void {
  }

  private _canvasElement: VariableElement;
  public set canvasElement(value: VariableElement) {
    this._canvasElement = value;
    value.onChange.addListener(() => {
      this.setMinMax(this.canvasElement.value);
    })
  }
  public get canvasElement(): VariableElement {
    return this._canvasElement;
  }

  public min: number = -5;
  public max: number = 5;

  public setMinMax(value: number): void {
    this.min = Math.min(value, this.min);
    this.max = Math.max(value, this.max);
  }
}
