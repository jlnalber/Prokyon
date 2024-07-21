import { Component } from '@angular/core';
import FormulaDialogElement from "../../global/classes/abstract/formulaDialogElement";
import AbstractLine from "../../global/classes/canvas-elements/abstractLine";

@Component({
  selector: 'app-view-abstract-line-element',
  templateUrl: './view-abstract-line-element.component.html',
  styleUrls: ['./view-abstract-line-element.component.css']
})
export class ViewAbstractLineElementComponent extends FormulaDialogElement {

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

  public get abcForm(): string {
    const abc = this.dialogData.getABCFormLine();
    if (abc === undefined) {
      return 'kann nicht konstruiert werden'
    }

    const precision = 10 ** 2;
    const a = Math.round(abc.a * precision) / precision;
    const b = Math.round(abc.b * precision) / precision;
    const c = Math.round(abc.c * precision) / precision;

    return `${a.toLocaleString()} \u00B7 x + ${b.toLocaleString()} \u00B7 y = ${c.toLocaleString()}`;
  }

  public dialogData!: AbstractLine;

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
