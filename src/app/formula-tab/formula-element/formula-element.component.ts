import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ContextMenu, ContextMenuElement} from "../../context-menu/context-menu.directive";
import {CanvasElement} from "../../global/classes/abstract/canvasElement";
import {DrawerService} from "../../services/drawer.service";
import {FormulaElement} from "../../global/classes/abstract/formulaElement";
import {
  ViewDependencyPointElementsDialogComponent
} from "../../formula-dialogs/view-dependency-point-elements-dialog/view-dependency-point-elements-dialog.component";
import {DialogService} from "../../dialog/dialog.service";

@Component({
  selector: 'app-formula-element',
  templateUrl: './formula-element.component.html',
  styleUrls: ['./formula-element.component.css']
})
export class FormulaElementComponent implements AfterViewInit {

  @Input() canvasElement!: CanvasElement;
  @ViewChild('formula', {read: ViewContainerRef}) formula!: ViewContainerRef;
  private formulaElementComp?: FormulaElement;

  constructor(private readonly drawerService: DrawerService, private readonly dialogService: DialogService) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.formulaElementComp = this.formula.createComponent(this.canvasElement.componentType).instance;
      this.formulaElementComp.canvasElement = this.canvasElement;
    })
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
        const dialog: ContextMenuElement[] = this.canvasElement.formulaDialogType !== undefined ? [{
          header: 'Anzeigen',
          click: () => {
            this.dialogService.createDialog(this.canvasElement.formulaDialogType!)?.open(this.canvasElement)
          },
          icon: 'visibility',
          title: 'Element anzeigen und bearbeiten.'
        }] : [];

        const selected = this.selected;
        const elements = [
          ...dialog,
          ...this.getContextMenuElementsFromFormulaElement(),
          {
            header: selected ? 'Auswahl entfernen' : 'Auswählen',
            click: () => {
              this.drawerService.selection.alternate(this.canvasElement || undefined);
            },
            icon: selected ? 'remove_done' : 'done',
            title: 'Dieses Element auswählen.'
          },
          {
            header: 'Löschen',
            color: 'red',
            click: () => {
              this.drawerService.removeCanvasElements(this.canvasElement);
            },
            icon: 'delete',
            title: 'Dieses Element löschen.'
          }
        ]

        if (selected) {
          elements.push({
            header: 'Auswahl löschen',
            click: () => {
              this.drawerService.removeCanvasElements(...this.drawerService.selection.toArray());
            },
            color: 'red',
            icon: 'delete_sweep',
            title: 'Alle ausgewählten Elemente löschen.'
          })
        }

        return elements;
      },
      additionalEvent: this.formulaElementComp?.contextMenu.additionalEvent,
      defaultPopUpPosition: this.formulaElementComp?.contextMenu.defaultPopUpPosition
    }
  }

}
