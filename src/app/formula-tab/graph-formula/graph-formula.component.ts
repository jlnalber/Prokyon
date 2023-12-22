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

  public override canvasElement: Graph;

  constructor(private readonly drawerService: DrawerService, private readonly dialogService: DialogService) {
    super();
    this.canvasElement = Graph.getDefaultInstance(drawerService);
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
            const d = this.canvasElement.derive(this.drawerService.getNewColor());
            if (d !== undefined) {
              this.drawerService.addCanvasElements(d);
            }
          },
          disabled: !this.canvasElement.canDerive() || this.canvasElement.funcError,
          icon: 'south_east',
          title: 'Diese Funktion ableiten.'
        }, {
          header: 'Duplizieren',
          icon: 'content_copy',
          disabled: this.canvasElement.funcError,
          click: () => {
            try {
              this.drawerService.addCanvasElements(this.canvasElement.clone());
            } catch {}
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
