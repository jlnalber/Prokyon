import { Component, OnInit } from '@angular/core';
import {Func} from "../global/classes/func/func";
import {Dialog} from "../dialog/dialog.service";
import {
  extremumPointsInInterval,
  inflectionPointsInInterval,
  zeroPointsInInterval
} from "../global/classes/func/funcAnalyser";
import {DrawerService} from "../services/drawer.service";
import PointElement from "../global/classes/canvas-elements/pointElement";
import {Color} from "../global/interfaces/color";
import {SnackbarService} from "../snackbar/snackbar.service";

export interface FuncAnalyserDialogData {
  func?: Func,
  color?: Color
}

@Component({
  selector: 'app-func-analyser-dialog',
  templateUrl: './func-analyser-dialog.component.html',
  styleUrls: ['./func-analyser-dialog.component.css']
})
export class FuncAnalyserDialogComponent implements OnInit {

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

  ngOnInit(): void {
  }

  evaluateZeroPoints() {
    try {
      if (this.dialogData?.func) {
        const result = zeroPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).map(p => {
          return new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor());
        });
        this.snackbarService.openSnackbar(this.getMessage('Nullpunkt', result.length));
        this.drawerService.addCanvasElement(...result);
      }
    } catch {
      this.openErrorSnackbar();
    }
    this.dialog.close();
  }

  evaluateExtremumPoints() {
    try {
      if (this.dialogData?.func) {
        const result = extremumPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).map(p => {
          return new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor());
        });
        this.snackbarService.openSnackbar(this.getMessage('Extrempunkt', result.length));
        this.drawerService.addCanvasElement(...result);
      }
    } catch {
      this.openErrorSnackbar();
    }
    this.dialog.close();
  }

  evaluateInflectionPoints() {
    try {
      if (this.dialogData?.func) {
        const result = inflectionPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).map(p => {
          return new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor());
        });
        this.snackbarService.openSnackbar(this.getMessage('Wendepunkt', result.length));
        this.drawerService.addCanvasElement(...result);
      }
    } catch {
      this.openErrorSnackbar();
    }
    this.dialog.close();
  }

  private getMessage(name: string, count: number): string {
    if (count !== 1) {
      name += 'e';
    }
    if (count === 0) {
      return `Keine ${name} gefunden.`;
    }
    else if (count === 1) {
      return `Ein ${name} gefunden.`;
    }
    else {
      return `${count} ${name} gefunden.`;
    }
  }

  private openErrorSnackbar(errorMessage: string = 'Ein unerwarteter Fehler ist aufgetreten!'): void {
    this.snackbarService.openSnackbar(errorMessage, {
      color: 'white',
      background: '#c44'
    })
  }
}
