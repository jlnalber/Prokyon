import { Component } from '@angular/core';
import {Func} from "../global/classes/func/func";
import {Color} from "../global/interfaces/color";
import {DrawerService} from "../services/drawer.service";
import {SnackbarService} from "../snackbar/snackbar.service";
import {Subtraction} from "../global/classes/func/operations/elementary-operations/subtraction";
import {ExternalFunction} from "../global/classes/func/operations/externalFunction";
import {Variable} from "../global/classes/func/operations/variable";
import {zerosInInterval} from "../global/classes/func/funcAnalyser";
import {countDerivatives} from "../global/classes/func/funcInspector";
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

  constructor(private readonly drawerService: DrawerService, private readonly snackbarService: SnackbarService) { }

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
        const color = this.dialogData.color ?? this.drawerService.getNewColor();
        const variableKey = 'x';

        this.drawerService.addCanvasElements(new DependencyPointElements(this.drawerService, (from: number, to: number, depth: number) => {
          // Helper function:
          const getFuncProviderFor: (graph: Graph) => ((key: string) => Func) = (graph: Graph) => {
            return (key: string) => {
              let f = graph.func;

              // Try to count how often the function needs to be derived.
              const derivativesKey = countDerivatives(key);
              const derivativesFunc = graph.func.name ? countDerivatives(graph.func.name) : 0;
              const diff = derivativesKey - derivativesFunc;
              if (diff < 0) {
                throw 'can\'t integrate';
              }

              for (let i = 0; i < diff; i++) {
                f = f.derive();
              }
              return f;
            }
          }

          // First, prepare a difference function.
          const diffFunc = new Func(new Subtraction(new ExternalFunction(graph1.func.name ?? '', getFuncProviderFor(graph1), new Variable(variableKey)),
            new ExternalFunction(graph2.func.name ?? '', getFuncProviderFor(graph2), new Variable(variableKey)),
          ), undefined, variableKey);

          // Then, calculate the zeros.
          const variables = this.drawerService.getVariables();
          return zerosInInterval(diffFunc, variables, from, to, depth).map(x => {
            return {
              x,
              y: graph1.func.evaluate(x, variables)
            }
          })
        }, this.from, this.to, this.depth, () => {
          // Check whether both of the graphs are still available.
          let graph1Found: boolean = false;
          let graph2Found: boolean = false;
          for (let canvasElement of this.drawerService.canvasElements) {
            if (canvasElement === graph1) graph1Found = true;
            else if (canvasElement === graph2) graph2Found = true;
          }
          return graph1Found && graph2Found;
        }, ['Schnittpunkte', () => {
          // Provide a label for the component in the panel.
          return graph1.func.name && graph2.func.name ? `${graph1.func.name}, ${graph2.func.name}` : undefined
        }], color, true, (result: Point[]) => {
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
