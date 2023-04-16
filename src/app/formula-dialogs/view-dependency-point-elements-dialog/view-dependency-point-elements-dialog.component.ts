import {Component} from '@angular/core';
import DependencyPointElements from "../../global/classes/canvas-elements/dependencyPointElements";
import {Dialog} from "../../dialog/dialog";
import {DrawerService} from "../../services/drawer.service";
import {Point} from "../../global/interfaces/point";
import PointElement from "../../global/classes/canvas-elements/pointElement";
import FormulaDialogElement from "../../global/classes/abstract/formulaDialogElement";

export interface ViewDependencyPointElementsDialogData {
  dependencyPointElements?: DependencyPointElements
}

@Component({
  selector: 'app-dependency-point-elements-dialog',
  templateUrl: './view-dependency-point-elements-dialog.component.html',
  styleUrls: ['./view-dependency-point-elements-dialog.component.css']
})
export class ViewDependencyPointElementsDialogComponent extends FormulaDialogElement {

  public override dialogData!: DependencyPointElements;

  constructor(private readonly drawerService: DrawerService) {
    super();
  }

  addPointToDrawerService(point: Point): void {
    this.drawerService.addCanvasElements(new PointElement(point, this.drawerService.getNewColor()));
  }

}
