import { Component } from '@angular/core';
import PointElement from "../../global/classes/canvas-elements/pointElement";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";

@Component({
  selector: 'app-point-formula',
  templateUrl: './point-formula.component.html',
  styleUrls: ['./point-formula.component.css']
})
export class PointFormulaComponent extends FormulaElement {

  public canvasElement: PointElement;

  constructor() {
    super();
    this.canvasElement = new PointElement({
      x: 0,
      y: 0
    });
  }

  public get name(): string {
    return this.canvasElement.configuration.name
      ? this.canvasElement.configuration.name + ' '
      : '';
  }

}
