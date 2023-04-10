import { Component } from '@angular/core';
import {
  extremumPointsInInterval,
  inflectionPointsInInterval,
  zeroPointsInInterval
} from "../global/classes/func/funcAnalyser";
import {DrawerService} from "../services/drawer.service";
import {SnackbarService} from "../snackbar/snackbar.service";
import {
  getDependencyStillActiveListenerForGraphDependency,
  getLabelForGraphDependency,
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
        // Create a dependency point elements canvas element, which will adapt to a change in the graph.
        const graph = this.dialogData.graph;
        this.createDependencyPointElements(graph, (from: number, to: number, depth: number) => {
          return zeroPointsInInterval(graph.func, this.drawerService.getVariables(), from, to, depth);
        }, 'Nullpunkt');
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  evaluateExtremumPoints() {
    try {
      if (this.dialogData && this.dialogData.graph) {
        // try to derive (throws an error, when derivation doesn't work) --> opens error snackbar
        this.dialogData.graph.func.derive();

        // Create a dependency point elements canvas element, which will adapt to a change in the graph.
        const graph = this.dialogData.graph;
        this.createDependencyPointElements(graph, (from: number, to: number, depth: number) => {
          return extremumPointsInInterval(graph.func, this.drawerService.getVariables(), from, to, depth);
        }, 'Extrempunkt');
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  evaluateInflectionPoints() {
    try {
      if (this.dialogData && this.dialogData.graph) {
        const d = DependencyPointElements.createInflectionPoints(this.drawerService,)

        // try to derive (throws an error, when derivation doesn't work) --> opens error snackbar
        this.dialogData.graph.func.derive();

        // Create a dependency point elements canvas element, which will adapt to a change in the graph.
        const graph = this.dialogData.graph;
        this.createDependencyPointElements(graph, (from: number, to: number, depth: number) => {
          return inflectionPointsInInterval(graph.func, this.drawerService.getVariables(), from, to, depth);
        }, 'Wendepunkt');
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  private createDependencyPointElements(graph: Graph, pointsProvider: (from: number, to: number, depth: number) => Point[], name: string): DependencyPointElements {
    // Create a dependency point elements canvas elements, which will adapt to change on the graph.
    const dependencyPointElements = new DependencyPointElements(this.drawerService, pointsProvider,
      this.from, this.to, this.depth,
      getDependencyStillActiveListenerForGraphDependency(this.drawerService, graph),
      getLabelForGraphDependency(`${name}e`, graph), graph.color, true, (result: Point[]) => {
      openSnackbarWithMessageForSpecialPoints(this.snackbarService, name, result.length);
    });
    this.drawerService.addCanvasElements(dependencyPointElements);
    return dependencyPointElements;
  }
}
