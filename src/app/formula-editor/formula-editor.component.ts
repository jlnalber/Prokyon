import { Component, OnInit } from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {Graph} from "../global/classes/graph";
import {Constant} from "../global/classes/func/operations/constant";
import {Func} from "../global/classes/func/func";

@Component({
  selector: 'app-formula-editor',
  templateUrl: './formula-editor.component.html',
  styleUrls: ['./formula-editor.component.css']
})
export class FormulaEditorComponent implements OnInit {

  constructor(public readonly drawerService: DrawerService) { }

  get graphs(): Graph[] {
    let graphs = [];
    for (let cEl of this.drawerService.canvasElements) {
      if (cEl instanceof Graph) {
        graphs.push(cEl);
      }
    }
    return graphs;
  }

  ngOnInit(): void {
  }

  addClick() {
    let graph = new Graph(new Func(new Constant(0)));
    graph.configuration.formula = '0';
    graph.configuration.editable = true;
    this.drawerService.addCanvasElement(graph);
  }
}
