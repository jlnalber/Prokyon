import { Component } from '@angular/core';
import {Func} from "../global/classes/func/func";
import {
  extremumPointsInInterval,
  inflectionPointsInInterval,
  zeroPointsInInterval
} from "../global/classes/func/funcAnalyser";
import {DrawerService} from "../services/drawer.service";
import PointElement from "../global/classes/canvas-elements/pointElement";
import {Color} from "../global/interfaces/color";
import {SnackbarService} from "../snackbar/snackbar.service";
import {openErrorSnackbar, openSnackbarWithMessageForSpecialPoints} from "../global/essentials/analysingFunctionsUtils";
import {Dialog} from "../dialog/dialog";

export interface FuncAnalyserDialogData {
  func?: Func,
  color?: Color
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
      if (this.dialogData?.func) {
        const result = zeroPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).map(p => {
          return new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor());
        });
        openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Nullpunkt', result.length);
        this.drawerService.addCanvasElements(...result);
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  evaluateExtremumPoints() {
    try {
      if (this.dialogData?.func) {
        const result = extremumPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).map(p => {
          return new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor());
        });
        openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Extrempunkt', result.length);
        this.drawerService.addCanvasElements(...result);
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }

  evaluateInflectionPoints() {
    try {
      if (this.dialogData?.func) {
        const result = inflectionPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).map(p => {
          return new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor());
        });
        openSnackbarWithMessageForSpecialPoints(this.snackbarService, 'Wendepunkt', result.length);
        this.drawerService.addCanvasElements(...result);
      }
    } catch {
      openErrorSnackbar(this.snackbarService);
    }
    this.dialog.close();
  }
}
