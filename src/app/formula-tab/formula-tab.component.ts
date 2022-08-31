import {Component, OnInit} from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {Graph} from "../global/classes/canvas-elements/graph";
import {Constant} from "../global/classes/func/operations/constants/constant";
import {Func} from "../global/classes/func/func";
import PointElement from "../global/classes/canvas-elements/pointElement";
import {ContextMenu} from "../context-menu/context-menu.directive";

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
        icon: 'show_chart'
      },
      {
        header: 'Punkt hinzufügen',
        click: () => {
          this.addPoint();
        },
        icon: 'radio_button_checked'
      },
      {
        header: 'Alle löschen',
        click: () => {
          this.drawerService.emptyCanvasElements();
        },
        icon: 'delete',
        color: 'red'
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
    const graph = new Graph(new Func(new Constant(0)), this.drawerService.getNewColor());
    graph.configuration.formula = '0';
    graph.configuration.editable = true;
    this.drawerService.addCanvasElement(graph);
  }

  addPoint(): void {
    const pointElement = new PointElement({
      x: 0,
      y: 0
    }, this.drawerService.getNewColor());
    this.drawerService.addCanvasElement(pointElement);
  }
}
