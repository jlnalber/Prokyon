import {Component, Input, OnInit, Type} from '@angular/core';
import {Func} from "../../global/classes/func/func";
import {OperationsCompiler} from "../../global/classes/func/operationsCompiler";
import {Graph} from "../../global/classes/graph";
import {Constant} from "../../global/classes/func/operations/constants/constant";
import {DrawerService} from "../../services/drawer.service";
import {ContextMenu} from "../../contextMenu/context-menu.directive";
import {Color, getColorAsRgbaFunction} from "../../global/interfaces/color";
import {TabGroupComponent} from "../../tab-group/tab-group.component";
import {HoverConfiguration} from "../../hover-menu/hover-menu.directive";
import {ColorPickerComponent} from "../../color-picker/color-picker.component";

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {

  private canCompile: boolean = false;

  private _graph: Graph;
  @Input() set graph(value: Graph) {
    if (!value.configuration.formula) {
      value.configuration.formula = '';
    }
    this.canCompile = true;
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
      this.canCompile = true;
    }
    catch {
      this.canCompile = false;
    }
  }

  delete() {
    this.drawerService.removeCanvasElement(this.graph);
  }

  derive() {
    try {
      let derivedGraph = new Graph(this.graph.func.derive().simplify(), this.drawerService.getNewColorForGraph());
      derivedGraph.configuration.editable = true;
      derivedGraph.configuration.formula = derivedGraph.func.operationAsString;
      this.drawerService.addCanvasElement(derivedGraph);
    }
    catch (e: any) {
      console.log(e);
    }
  }

  duplicate() {
    try {
      let operation = this.graph.configuration.formula;
      if (operation) {
        let newFunc = new Func(new OperationsCompiler(operation).compile());
        let newGraph = new Graph(newFunc, this.graph.color, this.graph.visible, this.graph.lineWidth);
        newGraph.configuration = {
          formula: operation,
          editable: this.graph.configuration.editable ?? false
        }
        this.drawerService.addCanvasElement(newGraph);
      }
    } catch { }
  }

  canDerive(): boolean {
    try {
      this.graph.func.derive();
      return true;
    }
    catch {
      return false;
    }
  }

  public get contextMenu(): ContextMenu {
    return {
      elements: [{
        header: 'Ableiten',
        click: () => {
          this.derive();
        },
        disabled: !this.canDerive(),
        icon: 'south_east'
      },
      {
        header: 'Duplizieren',
        icon: 'content_copy',
        disabled: !this.canCompile,
        click: () => {
          this.duplicate();
        }
      },
      {
        header: 'Löschen',
        color: 'red',
        click: () => {
          this.delete();
        },
        icon: 'delete'
      }]
    }
  }

  public get hoverMenu(): HoverConfiguration {
    return {
      component: ColorPickerComponent,
      data: {
        getter: () => {
          return this.graph.color;
        },
        setter: (c: Color) => {
          this.graph.color = c;
          this.drawerService.redraw();
        }
      }
    };
  }

  public get color(): string {
    return getColorAsRgbaFunction(this.graph.color);
  }

  changeVisibility() {
    this.graph.visible = !this.graph.visible;
    this.drawerService.redraw();
  }
}
