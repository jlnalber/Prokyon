import { Component, OnInit } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import CircleElement from "../../global/classes/canvas-elements/circleElement";

@Component({
  selector: 'app-circle-formula',
  templateUrl: './circle-formula.component.html',
  styleUrls: ['./circle-formula.component.css']
})
export class CircleFormulaComponent extends FormulaElement implements OnInit {

  constructor() {
    super();
    this.canvasElement = new CircleElement(() => undefined, () => undefined);
  }

  ngOnInit(): void {
  }

  public canvasElement: CircleElement;

}
