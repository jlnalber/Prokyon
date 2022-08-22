import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ContextMenu, ContextMenuElement} from "../../contextMenu/context-menu.directive";
import {CanvasElement} from "../../global/classes/abstract/canvasElement";
import {DrawerService} from "../../services/drawer.service";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";

@Component({
  selector: 'app-formula-element',
  templateUrl: './formula-element.component.html',
  styleUrls: ['./formula-element.component.css']
})
export class FormulaElementComponent implements AfterViewInit {

  @Input() canvasElement!: CanvasElement;
  @ViewChild('formula', { read: ViewContainerRef }) formula!: ViewContainerRef;
  private formulaElementComponent?: FormulaElement;

  constructor(private readonly drawerService: DrawerService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.formulaElementComponent = this.formula.createComponent(this.canvasElement.componentType).instance;
      this.formulaElementComponent.canvasElement = this.canvasElement;
    })
  }

  delete() {
    this.drawerService.removeCanvasElement(this.canvasElement);
  }

  private getContextMenuElementsFromFormulaElement(): ContextMenuElement[] {
    if (this.formulaElementComponent) {
      return this.formulaElementComponent.contextMenu.elements;
    }
    return [];
  }
  get completeContextMenu(): ContextMenu {
    return {
      elements: [
        ...this.getContextMenuElementsFromFormulaElement(),
        {
          header: 'Löschen',
          color: 'red',
          click: () => {
            this.delete();
          },
          icon: 'delete'
        }
      ]
    }
  }

}
