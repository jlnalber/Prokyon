import { Component } from '@angular/core';
import FormulaDialogElement from "../../global/classes/abstract/formulaDialogElement";
import PointElement from "../../global/classes/canvas-elements/pointElement";

@Component({
  selector: 'app-view-point-element',
  templateUrl: './view-point-element.component.html',
  styleUrls: ['./view-point-element.component.css']
})
export class ViewPointElementComponent extends FormulaDialogElement {

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

  public dialogData!: PointElement;

}
