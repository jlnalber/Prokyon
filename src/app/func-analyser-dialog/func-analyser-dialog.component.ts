import { Component, OnInit } from '@angular/core';
import {Func} from "../global/classes/func/func";
import {Dialog} from "../dialog/dialog.service";

export interface FuncAnalyserDialogData {
  func?: Func
}

@Component({
  selector: 'app-func-analyser-dialog',
  templateUrl: './func-analyser-dialog.component.html',
  styleUrls: ['./func-analyser-dialog.component.css']
})
export class FuncAnalyserDialogComponent implements OnInit {

  public dialogData?: FuncAnalyserDialogData;
  public dialog!: Dialog<FuncAnalyserDialogComponent>;

  constructor() { }

  ngOnInit(): void {
  }

}
