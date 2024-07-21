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
    this.dialogData.svgLabel = undefined;
    this.dialogData.onChange.emit(value);
  }

  public dialogData!: PointElement;

  public get latex(): boolean {
    return !this.dialogData.configuration.dontUseLaTeX ?? true;
  }

  public set latex(value: boolean) {
    this.dialogData.configuration.dontUseLaTeX = !value;
    this.dialogData.onChange.emit();
  }

  public get displayBlack(): boolean {
    return this.dialogData.configuration.displayBlackLabel ?? false;
  }

  public set displayBlack(value: boolean) {
    this.dialogData.configuration.displayBlackLabel = value;
    this.dialogData.svgLabel = undefined;
    this.dialogData.onChange.emit();
  }

  public get labelSize(): number {
    return this.dialogData.configuration.labelSizeFactor ?? 1;
  }

  public set labelSize(value: number) {
    this.dialogData.configuration.labelSizeFactor = value;
    this.dialogData.onChange.emit();
  }
}
