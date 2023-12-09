import { Component } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import CurveElement from "../../global/classes/canvas-elements/curveElement";
import {DrawerService} from "../../services/drawer.service";
import {ContextMenu, ContextMenuElement} from "../../context-menu/context-menu.directive";
import {Graph} from "../../global/classes/canvas-elements/graph";
import {FuncAnalyserDialogComponent} from "../../func-analyser-dialog/func-analyser-dialog.component";
import DefiniteIntegral from "../../global/classes/canvas-elements/definiteIntegral";
import {IntersectionDialogComponent} from "../../intersection-dialog/intersection-dialog.component";

@Component({
  selector: 'app-curve-formula',
  templateUrl: './curve-formula.component.html',
  styleUrls: ['./curve-formula.component.css']
})
export class CurveFormulaComponent extends FormulaElement {

  constructor(private readonly drawerService: DrawerService) {
    super();
    this.canvasElement = CurveElement.getDefaultInstance(drawerService);
  }

  public canvasElement: CurveElement;

  public get name(): string {
    return this.canvasElement.configuration.name
      ? ' ' + this.canvasElement.configuration.name
      : '';
  }

  public override get contextMenu(): ContextMenu {
    return {
      elements: () => {
        const elements: ContextMenuElement[] = [{
          header: 'Duplizieren',
          icon: 'content_copy',
          disabled: this.canvasElement.error,
          click: () => {
            this.duplicate();
          },
          title: 'Diese Funktion duplizieren.'
        }]


        return elements;
      },
      additionalEvent: this.threePointsClickedEvent
    }
  }

  public duplicate(): void {
    const clone = this.canvasElement.clone();
    this.drawerService.addCanvasElements(clone);
  }

  public get errorMessageX(): string | undefined {
    return this.canvasElement.xErrorText;
  }

  public get errorMessageY(): string | undefined {
    return this.canvasElement.yErrorText;
  }

  public get errorMessageBottom(): string | undefined {
    return this.canvasElement.bottomErrorText;
  }

  public get errorMessageTop(): string | undefined {
    return this.canvasElement.topErrorText;
  }

}
