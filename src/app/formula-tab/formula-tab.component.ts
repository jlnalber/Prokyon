import {Component, OnInit} from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {Graph} from "../global/classes/canvas-elements/graph";
import {Constant} from "../global/classes/func/operations/constants/constant";
import {Func} from "../global/classes/func/func";
import PointElement from "../global/classes/canvas-elements/pointElement";
import {ContextMenu} from "../context-menu/context-menu.directive";
import CompiledPointElement from "../global/classes/canvas-elements/compiledPointElement";
import CurveElement from "../global/classes/canvas-elements/curveElement";

@Component({
  selector: 'app-formula-tab',
  templateUrl: './formula-tab.component.html',
  styleUrls: ['./formula-tab.component.css']
})
export class FormulaTabComponent implements OnInit {

  public contextMenu: ContextMenu = {
    elements: () => [
      {
        header: 'Funktion hinzufügen',
        click: () => {
          this.addGraph();
        },
        icon: 'show_chart',
        title: 'Eine Funktion hinzufügen.'
      },
      {
        header: 'Punkt hinzufügen',
        click: () => {
          this.addPoint();
        },
        icon: 'radio_button_checked',
        title: 'Einen Punkt hinzufügen.'
      },
      {
        header: 'Kurve hinzufügen',
        click: () => {
          this.addCurve();
        },
        icon: 'gesture',
        title: 'Eine Kurve hinzufügen.'
      },
      {
        header: 'Alle löschen',
        click: () => {
          this.drawerService.emptyCanvasElements();
        },
        icon: 'delete',
        color: 'red',
        title: 'Alle Elemente löschen.'
      }
    ]
  }

  constructor(public readonly drawerService: DrawerService) { }

  ngOnInit(): void {
  }

  addClick() {
    this.addGraph();
  }

  keyboardAdd(event: KeyboardEvent) {
    if (event.key == 'Enter' || event.key == ' ') {
      this.addClick();
    }
  }

  addGraph(): void {
    const graph = new Graph(this.drawerService.parseAndValidateProviderGraph, undefined, this.drawerService.getNewColor());
    graph.configuration.formula = '0';
    graph.configuration.editable = true;
    this.drawerService.addCanvasElements(graph);
  }

  addPoint(): void {
    const pointElement = new CompiledPointElement((t: string) => this.drawerService.parseAndValidateOperation(t), this.drawerService.getNewColor());
    this.drawerService.addCanvasElements(pointElement);
  }

  addCurve(): void {
    const curveElement = new CurveElement((t: string, vars: string[]) => this.drawerService.parseAndValidateOperation(t, true, vars), this.drawerService.getNewColor());
    this.drawerService.addCanvasElements(curveElement);
  }
}
