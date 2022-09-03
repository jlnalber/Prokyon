import { Component } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import DependencyPointElements from "../../global/classes/canvas-elements/dependencyPointElements";

@Component({
  selector: 'app-dependency-point-element-formula',
  templateUrl: './dependency-point-elements-formula.component.html',
  styleUrls: ['./dependency-point-elements-formula.component.css']
})
export class DependencyPointElementsFormulaComponent extends FormulaElement {

  public canvasElement!: DependencyPointElements;

}
