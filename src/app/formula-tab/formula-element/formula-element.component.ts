import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ContextMenu, ContextMenuElement} from "../../context-menu/context-menu.directive";
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
  private formulaElementComp?: FormulaElement;

  constructor(private readonly drawerService: DrawerService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.formulaElementComp = this.formula.createComponent(this.canvasElement.componentType).instance;
      this.formulaElementComp.canvasElement = this.canvasElement;
    })
  }

  delete() {
    this.drawerService.removeCanvasElement(this.canvasElement);
  }

  get selected(): boolean {
    return this.drawerService.selection.contains(this.canvasElement || undefined);
  }

  private getContextMenuElementsFromFormulaElement(): ContextMenuElement[] {
    if (this.formulaElementComp) {
      return this.formulaElementComp.contextMenu.elements();
    }
    return [];
  }
  get completeContextMenu(): ContextMenu {
    return {
      elements: () => {
        const selected = this.selected;
        return [
          ...this.getContextMenuElementsFromFormulaElement(),
          {
            header: selected ? 'Auswahl entfernen' : 'Auswählen',
            click: () => {
              this.drawerService.selection.alternate(this.canvasElement || undefined);
            },
            icon: selected ? 'remove_done' : 'done'
          },
          {
            header: 'Löschen',
            color: 'red',
            click: () => {
              this.delete();
            },
            icon: 'delete'
          }
        ]
      },
      additionalEvent: this.formulaElementComp?.contextMenu.additionalEvent,
      defaultPopUpPosition: this.formulaElementComp?.contextMenu.defaultPopUpPosition
    }
  }

}
