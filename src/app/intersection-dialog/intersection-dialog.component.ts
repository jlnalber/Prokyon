import { Component } from '@angular/core';
import {Func} from "../global/classes/func/func";
import {Color} from "../global/interfaces/color";
import {DrawerService} from "../services/drawer.service";
import {SnackbarService} from "../snackbar/snackbar.service";
import {Subtraction} from "../global/classes/func/operations/elementary-operations/subtraction";
import {ExternalFunction} from "../global/classes/func/operations/externalFunction";
import {Variable} from "../global/classes/func/operations/variable";
import {zerosInInterval} from "../global/classes/func/funcAnalyser";
import PointElement from "../global/classes/canvas-elements/pointElement";
import {countDerivatives} from "../global/classes/func/funcInspector";
import {openErrorSnackbar, openSnackbarWithMessageForSpecialPoints} from "../global/essentials/analysingFunctionsUtils";
import {Dialog} from "../dialog/dialog";

export interface IntersectionDialogData {
  func1?: Func,
  func2?: Func,
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

  getFuncName(func: Func | undefined): string {
    if (func && func.name) {
      return ` ${func.name}`;
    }
    return '';
  }

  evaluateIntersectionPoints() {
    let error = false;
    try {
      if (this.dialogData && this.dialogData.func1 && this.dialogData.func2) {
        // Helper function:
        const getFuncProviderFor: (func: Func) => ((key: string) => Func) = (func: Func) => {
          return (key: string) => {
            let f = func;
            for (let i = 0; i < countDerivatives(key); i++) {
              f = f.derive();
            }
            return f;
          }
        }

        // First, prepare a difference function.
        const func1 = this.dialogData.func1;
        const func2 = this.dialogData.func2;
        const variableKey = 'x';
        const diffFunc = new Func(new Subtraction(new ExternalFunction(func1.name ?? '', getFuncProviderFor(func1), new Variable(variableKey)),
                                                  new ExternalFunction(func2.name ?? '', getFuncProviderFor(func2), new Variable(variableKey)),
                                                 ), undefined, variableKey);

        // Then, calculate the zeros.
        const variables = this.drawerService.getVariables();
        const color = this.dialogData.color ?? this.drawerService.getNewColor();
        const result = zerosInInterval(diffFunc, variables, this.from, this.to, this.depth).map(x => {
          return {
            x,
            y: func1.evaluate(x, variables)
          }
        }).map(p => {
          return new PointElement(p, color);
        })
        openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Schnittpunkt', result.length);
        this.drawerService.addCanvasElements(...result);
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
