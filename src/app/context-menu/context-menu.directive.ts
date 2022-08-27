import {ComponentRef, Directive, Input, ViewContainerRef} from '@angular/core';
import {ContextMenuComponent} from "./context-menu/context-menu.component";
import {Event as CustomEvent} from "../global/essentials/event";
import {Point} from "../global/interfaces/point";

@Directive({
  selector: '[appContextMenu]'
})
export class ContextMenuDirective {

  private contextMenu?: ComponentRef<ContextMenuComponent>;

  private _appContextMenu!: ContextMenu;
  public get appContextMenu(): ContextMenu {
    return this._appContextMenu;
  }
  @Input() public set appContextMenu(value: ContextMenu) {
    if (this._appContextMenu && this._appContextMenu.additionalEvent) {
      this._appContextMenu.additionalEvent.removeListener(this.customContextMenuActivateListener);
    }
    if (value.additionalEvent) {
      value.additionalEvent.addListener(this.customContextMenuActivateListener);
    }
    this._appContextMenu = value;
  }
  private readonly element: Element;

  constructor(private readonly vc: ViewContainerRef) {
    this.element = vc.element.nativeElement as Element;

    this.element.addEventListener('contextmenu', this.contextmenuEventListener);

    document.addEventListener('click', this.closeContextMenuEventListener);
    document.addEventListener('wheel', this.closeContextMenuEventListener);
    document.addEventListener('contextmenu', this.contextmenuDocumentEventListener);
    document.addEventListener('keydown', this.keyboardDocumentEventListener);
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

      this.showContextMenuAt({
        x: e.x,
        y: e.y
      });
    }
  }

  customContextMenuActivateListener = (p?: Point) => {
    let point: Point | undefined = p;
    if (!point) {
      point = this.appContextMenu.defaultPopUpPosition;
      if (!point) {
        point = this.element.getBoundingClientRect() ?? {
          x: 0,
          y: 0
        };
      }
    }
    this.showContextMenuAt(point);
  }

  public showContextMenuAt(p: Point): void {
    if (this.contextMenu) this.contextMenu.destroy();
    this.contextMenu = this.vc.createComponent(ContextMenuComponent);
    this.contextMenu.instance.position = p;
    this.contextMenu.instance.contextMenu = this.appContextMenu;
  }
}

export interface ContextMenu {
  elements: ContextMenuElement[],
  additionalEvent?: CustomEvent<Point>,
  defaultPopUpPosition?: Point
}

export interface ContextMenuElement {
  header: string,
  color?: string,
  click?: (ev?: Event) => void,
  icon?: string,
  disabled?: boolean
}
