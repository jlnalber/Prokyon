import {Component, Input, OnInit} from '@angular/core';
import {Func} from "../../global/classes/func/func";
import {OperationsCompiler} from "../../global/classes/func/operationsCompiler";
import {Graph} from "../../global/classes/graph";
import {Constant} from "../../global/classes/func/operations/constant";
import {DrawerService} from "../../services/drawer.service";

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {

  private _graph: Graph;
  @Input() set graph(value: Graph) {
    if (!value.configuration.formula) {
      value.configuration.formula = '';
    }
    this._graph = value;
  }
  get graph(): Graph {
    return this._graph;
  }

  constructor(private readonly drawerService: DrawerService) {
    this._graph = new Graph(new Func(new Constant(0)));
    this._graph.configuration.formula = '0';
  }

  ngOnInit(): void {
  }

  onChange(value: string) {
    try {
      let operation = new OperationsCompiler(value).compile();
      this.graph.func = new Func(operation)
      this.graph.configuration.formula = value;
    }
    catch { }
  }

  delete() {
    this.drawerService.removeCanvasElement(this.graph);
  }
}
