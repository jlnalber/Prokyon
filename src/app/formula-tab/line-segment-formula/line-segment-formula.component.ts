import { Component, OnInit } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import LineSegmentElement from "../../global/classes/canvas-elements/lineSegmentElement";

@Component({
  selector: 'app-line-segment-formula',
  templateUrl: './line-segment-formula.component.html',
  styleUrls: ['./line-segment-formula.component.css']
})
export class LineSegmentFormulaComponent extends FormulaElement implements OnInit {

  constructor() {
    super();
    this.canvasElement = new LineSegmentElement(() => [undefined, undefined]);
  }

  ngOnInit(): void {
  }

  public canvasElement: LineSegmentElement;

}
