import { Component } from '@angular/core';
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

export interface FuncAnalyserDialogData {
  graph?: Graph
}

@Component({
  selector: 'app-func-analyser-dialog',
  templateUrl: './func-analyser-dialog.component.html',
  styleUrls: ['./func-analyser-dialog.component.css']
})
export class FuncAnalyserDialogComponent {

  public dialogData?: FuncAnalyserDialogData;
  public dialog!: Dialog<FuncAnalyserDialogComponent>;

  public from: number = -1;
  public to: number = 1;

  private _depth: number = 10;
  public get depth(): number {
    return this._depth;
  }
  public set depth(value: number) {
    this._depth = Math.floor(value);
  }

  constructor(private readonly drawerService: DrawerService, private readonly snackbarService: SnackbarService) { }

  evaluateZeroPoints() {
    try {
      if (this.dialogData && this.dialogData.graph) {
        // create a dependency point element for extremum points
        this.drawerService.addCanvasElements(DependencyPointElements.createZeroPoints(this.drawerService,
          this.dialogData.graph, this.from, this.to, this.depth, (result: Point[]) => {
            openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Nullpunkt', result.length);
          }));
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  evaluateExtremumPoints() {
    try {
      if (this.dialogData && this.dialogData.graph) {
        // create a dependency point element for extremum points
        this.drawerService.addCanvasElements(DependencyPointElements.createExtremumPoints(this.drawerService,
          this.dialogData.graph, this.from, this.to, this.depth, (result: Point[]) => {
            openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Extrempunkt', result.length);
          }));
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  evaluateInflectionPoints() {
    try {
      if (this.dialogData && this.dialogData.graph) {
        // create a dependency point element for inflection points
        const d = DependencyPointElements.createInflectionPoints(this.drawerService, this.dialogData.graph,
          this.from, this.to, this.depth, (result: Point[]) => {
            openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Wendepunkt', result.length);
          });
        this.drawerService.addCanvasElements(d);
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }
}
