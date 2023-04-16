import { Component } from '@angular/core';
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import DependencyPointElements from "../../global/classes/canvas-elements/dependencyPointElements";
import {ContextMenu, ContextMenuElement} from "../../context-menu/context-menu.directive";
import {DialogService} from "../../dialog/dialog.service";
import {
  ViewDependencyPointElementsDialogComponent
} from "../../formula-dialogs/view-dependency-point-elements-dialog/view-dependency-point-elements-dialog.component";

@Component({
  selector: 'app-dependency-point-element-formula',
  templateUrl: './dependency-point-elements-formula.component.html',
  styleUrls: ['./dependency-point-elements-formula.component.css']
})
export class DependencyPointElementsFormulaComponent extends FormulaElement {

  constructor(private readonly dialogService: DialogService) {
    super();
  }

  public canvasElement!: DependencyPointElements;

  get elementCountStr(): string {
    const size = this.canvasElement.size;
    if (size === 0) {
      return 'Keine Elemente'
    } else if (size === 1) {
      return 'Ein Element'
    } else {
      return `${size} Elemente`;
    }
  }

}
