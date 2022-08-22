import {Component, Input, OnInit} from '@angular/core';
import {Func} from "../../global/classes/func/func";
import {Graph} from "../../global/classes/graph";
import {Constant} from "../../global/classes/func/operations/constants/constant";
import {DrawerService} from "../../services/drawer.service";
import {ContextMenu} from "../../contextMenu/context-menu.directive";
import {Color, getColorAsRgbaFunction} from "../../global/interfaces/color";
import {HoverConfiguration} from "../../hover-menu/hover-menu.directive";
import {ColorPickerComponent} from "../../color-picker/color-picker.component";
import {FuncParser} from "../../global/classes/func/funcParser";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";

@Component({
  selector: 'app-graph-formula',
  templateUrl: './graph-formula.component.html',
  styleUrls: ['./graph-formula.component.css']
})
export class GraphFormulaComponent extends FormulaElement implements OnInit {

  public errorMessage: string | undefined = undefined;

  private _canvasElement: Graph;
  @Input() set canvasElement(value: Graph) {
    if (!value.configuration.formula) {
      value.configuration.formula = '';
    }
    this.errorMessage = undefined;
    this._canvasElement = value;
  }
  get canvasElement(): Graph {
    return this._canvasElement;
  }

  constructor(private readonly drawerService: DrawerService) {
    super();
    this._canvasElement = new Graph(new Func(new Constant(0)));
    this._canvasElement.configuration.formula = '0';
  }

  ngOnInit(): void {
  }

  onChange(value: string) {
    let res = this.drawerService.parseAndValidateFunc(value);
    if (res instanceof Func) {
      this.errorMessage = undefined;
      this.canvasElement.func = res;
      this.canvasElement.func.stopEvaluation = false;
      this.canvasElement.configuration.formula = value;
    }
    else {
      this.errorMessage = res;
      this.canvasElement.func.stopEvaluation = true;
    }
  }

  derive() {
    try {
      let derivedGraph = new Graph(this.canvasElement.func.derive(), this.drawerService.getNewColorForGraph());
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
      let formula = this.canvasElement.configuration.formula;
      if (formula) {
        let newFunc = new FuncParser(formula, this.drawerService.funcProvider).parse();
        let newGraph = new Graph(newFunc, this.canvasElement.color, this.canvasElement.visible, this.canvasElement.lineWidth);
        newGraph.configuration = {
          formula: formula,
          editable: this.canvasElement.configuration.editable ?? false
        }
        this.drawerService.addCanvasElement(newGraph);
      }
    } catch { }
  }

  canDerive(): boolean {
    try {
      this.canvasElement.func.derive();
      return true;
    }
    catch {
      return false;
    }
  }

  public override get contextMenu(): ContextMenu {
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
        disabled: this.errorMessage !== undefined,
        click: () => {
          this.duplicate();
        }
      }]
    }
  }

  public get hoverMenu(): HoverConfiguration {
    return {
      component: ColorPickerComponent,
      data: {
        getter: () => {
          return this.canvasElement.color;
        },
        setter: (c: Color) => {
          this.canvasElement.color = c;
          this.drawerService.redraw();
        }
      }
    };
  }

  public get color(): string {
    return getColorAsRgbaFunction(this.canvasElement.color);
  }

  changeVisibility() {
    this.canvasElement.visible = !this.canvasElement.visible;
    this.drawerService.redraw();
  }
}
