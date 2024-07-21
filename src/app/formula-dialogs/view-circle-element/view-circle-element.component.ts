import { Component } from '@angular/core';
import FormulaDialogElement from "../../global/classes/abstract/formulaDialogElement";
import CircleElement from "../../global/classes/canvas-elements/circleElement";
import {Point} from "../../global/interfaces/point";

const precision = 10 ** 2;

@Component({
  selector: 'app-view-circle-element',
  templateUrl: './view-circle-element.component.html',
  styleUrls: ['./view-circle-element.component.css']
})
export class ViewCircleElementComponent extends FormulaDialogElement {

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

  public isDefined(): boolean {
    return this.dialogData.point !== undefined && this.dialogData.radius !== undefined;
  }

  public get radius(): string {
    return (Math.round(this.dialogData.radius! * precision) / precision).toLocaleString();
  }

  public get pointX(): string {
    const p = this.dialogData.point!;
    return (Math.round(p.x * precision) / precision).toLocaleString();
  }

  public get pointY(): string {
    const p = this.dialogData.point!;
    return (Math.round(p.y * precision) / precision).toLocaleString();
  }

  public dialogData!: CircleElement;

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
