import {Component, Input, OnInit} from '@angular/core';
import {Func} from "../../global/classes/func/func";
import {Graph} from "../../global/classes/canvas-elements/graph";
import {Constant} from "../../global/classes/func/operations/constants/constant";
import {DrawerService} from "../../services/drawer.service";
import {getColorAsRgbaFunction} from "../../global/interfaces/color";
import {FuncParser} from "../../global/classes/func/funcParser";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import {DialogService} from "../../dialog/dialog.service";
import {FuncAnalyserDialogComponent} from "../../func-analyser-dialog/func-analyser-dialog.component";

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

  constructor(private readonly drawerService: DrawerService, private readonly dialogService: DialogService) {
    super();
    this._canvasElement = new Graph(new Func(new Constant(0)));
    this._canvasElement.configuration.formula = '0';
  }

  ngOnInit(): void {
  }

  onChange(value: string) {
    // on change, try to parse the function, otherwise "crash" --> show error message, don't render graph
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
      this.canvasElement.onChange.emit();
    }
  }

  derive() {
    try {
      let derivedGraph = new Graph(this.canvasElement.func.derive(), this.drawerService.getNewColor());
      derivedGraph.configuration.editable = true;
      derivedGraph.configuration.formula = derivedGraph.func.operationAsString;
      this.drawerService.addCanvasElements(derivedGraph);
    }
    catch { }
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
        this.drawerService.addCanvasElements(newGraph);
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

  public override get contextMenu() {
    return {
    elements: () => [{
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
      },
      {
        header: 'Analysieren',
        icon: 'query_stats',
        click: () => {
          this.dialogService.createDialog(FuncAnalyserDialogComponent)?.open({
            func: this.canvasElement.func,
            color: this.canvasElement.color
          });
        }
      }],
      additionalEvent: this.threePointsClickedEvent
    }
  }

  public get color(): string {
    return getColorAsRgbaFunction(this.canvasElement.color);
  }
}
