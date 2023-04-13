import { Component } from '@angular/core';
import {Color} from "../global/interfaces/color";
import {DrawerService} from "../services/drawer.service";
import {SnackbarService} from "../snackbar/snackbar.service";
import {
  openErrorSnackbar,
  openSnackbarWithMessageForSpecialPoints
} from "../global/essentials/analysingFunctionsUtils";
import {Dialog} from "../dialog/dialog";
import {Graph} from "../global/classes/canvas-elements/graph";
import DependencyPointElements from "../global/classes/canvas-elements/dependencyPointElements";
import {Point} from "../global/interfaces/point";

export interface IntersectionDialogData {
  graph1?: Graph,
  graph2?: Graph,
  color?: Color
}

@Component({
  selector: 'app-intersection-dialog',
  templateUrl: './intersection-dialog.component.html',
  styleUrls: ['./intersection-dialog.component.css']
})
export class IntersectionDialogComponent {

  public dialogData?: IntersectionDialogData;
  public dialog!: Dialog<IntersectionDialogComponent>

  public from: number = -1;
  public to: number = 1;

  private _depth: number = 10;
  public get depth(): number {
    return this._depth;
  }

  public set depth(value: number) {
    this._depth = Math.floor(value);
  }

  constructor(private readonly drawerService: DrawerService, private readonly snackbarService: SnackbarService) {
  }

  getFuncName(graph: Graph | undefined): string {
    if (graph && graph.func.name) {
      return ` ${graph.func.name}`;
    }
    return '';
  }

  evaluateIntersectionPoints() {
    let error = false;
    try {
      if (this.dialogData && this.dialogData.graph1 && this.dialogData.graph2) {
        // Collect the data.
        const graph1 = this.dialogData.graph1;
        const graph2 = this.dialogData.graph2;
        const color = this.dialogData.color;

        this.drawerService.addCanvasElements(DependencyPointElements.createIntersectionPoints(this.drawerService,
          graph1,
          graph2,
          this.from,
          this.to,
          this.depth,
          color,
          (result: Point[]) => {
            // Open the snackbar when first initialized.
            openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Schnittpunkt', result.length);
          }));
      } else {
        error = true;
      }
    } catch {
      error = true;
    }

    // If there was an error, display in a snackbar.
    if (error) {
      openErrorSnackbar(this.snackbarService);
    }

    // Close the dialog.
    this.dialog.close();
  }

}
