import {Component, OnInit, Type} from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {Graph} from "../global/classes/graph";
import {Constant} from "../global/classes/func/operations/constants/constant";
import {Func} from "../global/classes/func/func";
import {Color} from "../global/interfaces/color";
import {getNew, sameColors} from "../global/essentials/utils";
import {TabGroupComponent} from "../tab-group/tab-group.component";

export const colors: Color[] = [
  {
    r: 18,
    g: 128,
    b: 234
  },
  {
    r: 214,
    g: 78,
    b: 78
  },
  {
    r: 78,
    g: 194,
    b: 98
  },
  {
    r: 88,
    g: 88,
    b: 224
  },
  {
    r: 234,
    g: 234,
    b: 38
  },
  {
    r: 224,
    g: 48,
    b: 224
  },
  {
    r: 48,
    g: 224,
    b: 224
  }
]

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
    let graph = new Graph(new Func(new Constant(0)), this.drawerService.getNewColorForGraph());
    graph.configuration.formula = '0';
    graph.configuration.editable = true;
    this.drawerService.addCanvasElement(graph);
  }

  keyboardAdd(event: KeyboardEvent) {
    if (event.key == 'Enter' || event.key == ' ') {
      this.addClick();
    }
  }
}
