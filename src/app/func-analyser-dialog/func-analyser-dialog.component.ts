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

  constructor(private readonly drawerService: DrawerService) { }

  ngOnInit(): void {
  }

  evaluateZeroPoints() {
    if (this.dialogData?.func) {
      zeroPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).forEach(p => {
        this.drawerService.addCanvasElement(new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor()));
      })
    }
    this.dialog.close();
  }

  evaluateExtremumPoints() {
    if (this.dialogData?.func) {
      extremumPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).forEach(p => {
        this.drawerService.addCanvasElement(new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor()));
      })
    }
    this.dialog.close();
  }

  evaluateInflectionPoints() {
    if (this.dialogData?.func) {
      inflectionPointsInInterval(this.dialogData!.func!, this.drawerService.getVariables(), this.from, this.to, this.depth).forEach(p => {
        this.drawerService.addCanvasElement(new PointElement(p, this.dialogData?.color ?? this.drawerService.getNewColor()));
      })
    }
    this.dialog.close();
  }
}
