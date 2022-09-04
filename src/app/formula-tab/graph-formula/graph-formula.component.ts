import {Component, Input} from '@angular/core';
import {Func} from "../../global/classes/func/func";
import {Graph} from "../../global/classes/canvas-elements/graph";
import {Constant} from "../../global/classes/func/operations/constants/constant";
import {DrawerService} from "../../services/drawer.service";
import {getColorAsRgbaFunction} from "../../global/interfaces/color";
import {FuncParser} from "../../global/classes/func/funcParser";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import {DialogService} from "../../dialog/dialog.service";
import {FuncAnalyserDialogComponent} from "../../func-analyser-dialog/func-analyser-dialog.component";
import {ContextMenu, ContextMenuElement} from "../../context-menu/context-menu.directive";
import {IntersectionDialogComponent} from "../../intersection-dialog/intersection-dialog.component";
import DefiniteIntegral from "../../global/classes/canvas-elements/definiteIntegral";

@Component({
  selector: 'app-graph-formula',
  templateUrl: './graph-formula.component.html',
  styleUrls: ['./graph-formula.component.css']
})
export class GraphFormulaComponent extends FormulaElement {

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

  onChange(value: string) {
    if (value !== this.canvasElement.configuration.formula || this.canvasElement.func.stopEvaluation) {
      // on change, try to parse the function, otherwise "crash" --> show error message, don't render graph
      let res = this.drawerService.parseAndValidateFunc(value);
      if (res instanceof Func) {
        this.errorMessage = undefined;
        this.canvasElement.func = res;
        this.canvasElement.func.stopEvaluation = false;
        this.canvasElement.configuration.formula = value;
      } else {
        this.errorMessage = res;
        this.canvasElement.func.stopEvaluation = true;
        this.canvasElement.onChange.emit();
      }
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

  public override get contextMenu(): ContextMenu {
    return {
      elements: () => {
        const selection = this.drawerService.selection.toArray();
        const twoGraphsAvailable = selection.indexOf(this.canvasElement) !== -1
          && selection.length === 2
          && selection[0] instanceof Graph
          && selection[1] instanceof Graph;

        const elements: ContextMenuElement[] = [{
          header: 'Ableiten',
          click: () => {
            this.derive();
          },
          disabled: !this.canDerive(),
          icon: 'south_east',
          title: 'Diese Funktion ableiten.'
        }, {
          header: 'Duplizieren',
          icon: 'content_copy',
          disabled: this.errorMessage !== undefined,
          click: () => {
            this.duplicate();
          },
          title: 'Diese Funktion duplizieren.'
        }, {
          header: 'Analysieren',
          icon: 'query_stats',
          click: () => {
            this.dialogService.createDialog(FuncAnalyserDialogComponent)?.open({
              graph: this.canvasElement
            });
          },
          title: 'Nullpunkte, Extrempunkte oder Wendepunkte dieser Funktion bestimmen.'
        }, {
          header: 'Bestimmtes Integral',
          click: () => {
            this.drawerService.addCanvasElements(new DefiniteIntegral(this.canvasElement, undefined, -1, 1, 0.1, this.canvasElement.color));
          },
          icon: 'monitoring'
        }, {
          header: 'Schnittpunkte bestimmen',
          disabled: !twoGraphsAvailable,
          click: () => {
            if (twoGraphsAvailable) {
              this.dialogService.createDialog(IntersectionDialogComponent)?.open({
                graph1: selection[0] as Graph,
                graph2: selection[1] as Graph
              });
            }
          },
          title: twoGraphsAvailable ? 'Schnittpunkte der beiden ausgewählten Funktionen berechnen.' : 'Um Schnittpunkte zweier Funktionen zu berechnen, müssen zwei Funktionen ausgewählt sein.',
          icon: 'multiline_chart'
        }, {
          header: 'Fläche zwischen Graphen',
          disabled: !twoGraphsAvailable,
          click: () => {
            if (twoGraphsAvailable) {
              this.drawerService.addCanvasElements(new DefiniteIntegral(selection[0] as Graph, selection[1] as Graph, -1, 1, 0.1, this.drawerService.getNewColor()));
            }
          },
          title: twoGraphsAvailable ? 'Fläche zwischen den Graphen der beiden ausgewählten Funktionen berechnen.' : 'Um die Fläche zwischen den Graphen zweier Funktionen zu berechnen, müssen zwei Funktionen ausgewählt sein.',
          icon: 'stacked_line_chart'
        }]


        return elements;
      },
      additionalEvent: this.threePointsClickedEvent
    }
  }

  public get color(): string {
    return getColorAsRgbaFunction(this.canvasElement.color);
  }
}
