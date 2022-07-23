import {ComponentRef, Directive, Input, ViewContainerRef} from '@angular/core';
import {ContextMenuComponent} from "./context-menu/context-menu.component";

@Directive({
  selector: '[appContextMenu]'
})
export class ContextMenuDirective {

  private contextMenu?: ComponentRef<ContextMenuComponent>;

  @Input() public appContextMenu!: ContextMenu;
  private readonly element: Element;

  constructor(private readonly vc: ViewContainerRef) {
    this.element = vc.element.nativeElement as Element;

    this.element.addEventListener('contextmenu', this.contextmenuEventListener);

    document.addEventListener('click', this.closeContextMenuEventListener);
    document.addEventListener('wheel', this.closeContextMenuEventListener);
    document.addEventListener('contextmenu', this.contextmenuDocumentEventListener);
    document.addEventListener('keydown', this.keyboardDocumentEventListener)
  }

  contextmenuDocumentEventListener = (e: Event | PointerEvent) => {
    if (e instanceof PointerEvent && (e as any).path.indexOf(this.element) == -1 && this.contextMenu) {
      this.contextMenu.destroy();
    }
  }

  keyboardDocumentEventListener = (e: Event | KeyboardEvent) => {
    if (e instanceof KeyboardEvent && e.key == 'Escape' && this.contextMenu) {
      this.contextMenu.destroy();
    }
  }

  closeContextMenuEventListener = () => {
    if (this.contextMenu) {
      this.contextMenu.destroy();
    }
  }

  contextmenuEventListener = (e: Event | PointerEvent) => {
    if (e instanceof PointerEvent) {
      e.preventDefault();

      if (this.contextMenu) this.contextMenu.destroy();
      this.contextMenu = this.vc.createComponent(ContextMenuComponent);
      this.contextMenu.instance.position = {
        x: e.x,
        y: e.y
      };
      this.contextMenu.instance.contextMenu = this.appContextMenu;
    }
  }

}

export interface ContextMenu {
  elements: ContextMenuElement[]
}

export interface ContextMenuElement {
  header: string,
  color?: string,
  click?: (ev?: Event) => void,
  icon?: string,
  disabled?: boolean
}
