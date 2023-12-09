import { Component } from '@angular/core';
import FormulaDialogElement from "../../global/classes/abstract/formulaDialogElement";
import AbstractLine from "../../global/classes/canvas-elements/abstractLine";
import CurveElement from "../../global/classes/canvas-elements/curveElement";

@Component({
  selector: 'app-view-curve-element',
  templateUrl: './view-curve-element.component.html',
  styleUrls: ['./view-curve-element.component.css']
})
export class ViewCurveElementComponent extends FormulaDialogElement {

  constructor() {
    super();
  }

  public get name(): string {
    return this.dialogData.configuration.name ?
      this.dialogData.configuration.name :
      ''
  }

  public set name(value: string) {
    this.dialogData.configuration.name = value;
    this.dialogData.configuration.label = value;
    this.dialogData.onChange.emit(value);
  }

  public dialogData!: CurveElement;

  public get dashed(): boolean {
    return this.dialogData.configuration.dashed === true;
  }

  public set dashed(value: boolean) {
    this.dialogData.configuration.dashed = value;
    this.dialogData.onChange.emit();
  }

}
