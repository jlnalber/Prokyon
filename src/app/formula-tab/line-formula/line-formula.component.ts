import { Component, OnInit } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import LineElement from "../../global/classes/canvas-elements/lineElement";

@Component({
  selector: 'app-line-formula',
  templateUrl: './line-formula.component.html',
  styleUrls: ['./line-formula.component.css']
})
export class LineFormulaComponent extends FormulaElement implements OnInit {

  constructor() {
    super();
    this.canvasElement = new LineElement(() => undefined, () => undefined);
  }

  ngOnInit(): void {
  }

  public canvasElement: LineElement;

}
