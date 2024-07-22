import { Component, OnInit } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import LineElement from "../../global/classes/canvas-elements/lineElement";
import LineSegmentElement from "../../global/classes/canvas-elements/lineSegmentElement";
import CircleElement from "../../global/classes/canvas-elements/circleElement";
import AngleElement from 'src/app/global/classes/canvas-elements/angleElement';
import ShapeElement from 'src/app/global/classes/canvas-elements/shapeElement';

@Component({
  selector: 'app-geometric-formula',
  templateUrl: './geometric-formula.component.html',
  styleUrls: ['./geometric-formula.component.css']
})
export class GeometricFormulaComponent extends FormulaElement implements OnInit {

  constructor() {
    super();
    this.canvasElement = new LineElement(() => [undefined, undefined], [], () => {
      return {
        subType: '',
        els: []
      }
    });
  }

  ngOnInit(): void {
  }

  public canvasElement: LineElement | LineSegmentElement | CircleElement | AngleElement | ShapeElement;

  public get labelString(): string {
    const formula = this.canvasElement.configuration.formula;
    const label = this.canvasElement.configuration.label;

    if (label !== undefined && formula !== undefined) {
      return formula + ' ' + label;
    } else if (label !== undefined) {
      return label;
    } else if (formula !== undefined) {
      return formula;
    }
    return ' '
  }

}
