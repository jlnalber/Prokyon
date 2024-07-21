import { Component, OnInit } from '@angular/core';
import FormulaDialogElement from 'src/app/global/classes/abstract/formulaDialogElement';
import AngleElement from 'src/app/global/classes/canvas-elements/angleElement';

@Component({
  selector: 'app-view-angle-element',
  templateUrl: './view-angle-element.component.html',
  styleUrls: ['./view-angle-element.component.css']
})
export class ViewAngleElementComponent extends FormulaDialogElement {

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

  public get angle(): string {
    return (Math.floor(1000 * this.dialogData.angle) / 1000).toLocaleString();
  }

  public dialogData!: AngleElement;

  public get dashed(): boolean {
    return this.dialogData.configuration.dashed === true;
  }

  public set dashed(value: boolean) {
    this.dialogData.configuration.dashed = value;
    this.dialogData.onChange.emit();
  }

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