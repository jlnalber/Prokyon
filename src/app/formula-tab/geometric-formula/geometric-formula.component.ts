import { Component, OnInit } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import LineElement from "../../global/classes/canvas-elements/lineElement";
import LineSegmentElement from "../../global/classes/canvas-elements/lineSegmentElement";
import CircleElement from "../../global/classes/canvas-elements/circleElement";

@Component({
  selector: 'app-geometric-formula',
  templateUrl: './geometric-formula.component.html',
  styleUrls: ['./geometric-formula.component.css']
})
export class GeometricFormulaComponent extends FormulaElement implements OnInit {

  constructor() {
    super();
    this.canvasElement = new LineElement(() => [undefined, undefined], []);
  }

  ngOnInit(): void {
  }

  public canvasElement: LineElement | LineSegmentElement | CircleElement;

}
