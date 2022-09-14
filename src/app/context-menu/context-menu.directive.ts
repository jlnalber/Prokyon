import {ComponentRef, Directive, Input, OnDestroy, ViewContainerRef} from '@angular/core';
import {ContextMenuComponent} from "./context-menu/context-menu.component";
import {Event as CustomEvent} from "../global/essentials/event";
import {Point} from "../global/interfaces/point";

// These interfaces provide data about the context menu.

export interface ContextMenu {
  elements: () => ContextMenuElement[], // 'elements' provides each item in the context menu.
  additionalEvent?: CustomEvent<[Point, Event]>, // When 'additionalEvent' is triggered, the context menu should open as well
  defaultPopUpPosition?: Point // 'defaultPopUpPosition' specifies a default pop up position if the directive is unable to find a position.
}

export interface ContextMenuElement {
  header: string,
  color?: string,
  click?: (ev?: Event) => void,
  icon?: string,
  disabled?: boolean,
  title?: string
}

// This directive is responsible for context menus. It can be added on every HTML element or Angular component.

@Directive({
  selector: '[appContextMenu]'
})
export class ContextMenuDirective implements OnDestroy {

  // reference to the context menu component
  private contextMenu?: ComponentRef<ContextMenuComponent>;

  private _appContextMenu?: ContextMenu;
  public get appContextMenu(): ContextMenu | undefined {
    return this._appContextMenu;
  }
  @Input() public set appContextMenu(value: ContextMenu | undefined) {
    // First, remove the customContextMenuActivateListener from the old appContextMenu
    if (this._appContextMenu && this._appContextMenu.additionalEvent) {
      this._appContextMenu.additionalEvent.removeListener(this.customContextMenuActivateListener);
    }

    // then, add the customContextMenuActivateListener to the new appContextMenu
    if (value && value.additionalEvent) {
      value.additionalEvent.addListener(this.customContextMenuActivateListener);
    }
    this._appContextMenu = value;
  }

  // The HTMLElement that wants a context menu.
  private readonly element: Element;

  constructor(private readonly vc: ViewContainerRef) {
    this.element = vc.element.nativeElement as Element;

    this.element.addEventListener('contextmenu', this.contextmenuEventListener);
  }

  ngOnDestroy() {
    // Remove the context menu and its listeners.
    this.element.removeEventListener('contextmenu', this.contextmenuEventListener)
    this.destroyContextMenu();
  }

  // #region The listeners
  private contextmenuDocumentEventListener = (e: Event) => {
    // listener that closes the context menu when another one is triggered
    if ((e instanceof PointerEvent || e instanceof MouseEvent) && e.composedPath().indexOf(this.element) === -1) {
      this.destroyContextMenu();
    }
  }

  private keyboardDocumentEventListener = (e: Event | KeyboardEvent) => {
    // this listener closes the context menu when esc is clicked
    if (e instanceof KeyboardEvent && e.key == 'Escape') {
      this.destroyContextMenu();
    }
  }

  private closeContextMenuEventListener = (ev: Event) => {
    if (ev !== this.skipEvent) {
      // this listener destroys the context menu
      this.destroyContextMenu();
    }
    this.skipEvent = undefined;
  }

  private contextmenuEventListener = (e: Event) => {
    // this listener opens the custom context menu instead of the usual one of the browser
    if (e instanceof PointerEvent || e instanceof MouseEvent) {
      e.preventDefault();

      this.showContextMenuAt({
        x: e.x,
        y: e.y
      });
    }
  }

  private skipEvent?: Event;
  private customContextMenuActivateListener = (p?: [Point, Event]) => {
    // this listener tries to open the context menu at a (given) position
    let point: Point | undefined = p ? p[0] : undefined;
    this.skipEvent = p ? p[1] : undefined; // The context menu shouldn't close immediately after creation.
    if (!point && this._appContextMenu) {
      point = this._appContextMenu.defaultPopUpPosition;
    }
    if (!point) {
      point = this.element.getBoundingClientRect() ?? {
        x: 0,
        y: 0
      };
    }
    this.showContextMenuAt(point);
  }
  // #endregion

  private showContextMenuAt(p: Point): void {
    this.destroyContextMenu();
    if (this._appContextMenu) {
      // create a new context menu and set the position and elements
      this.contextMenu = this.vc.createComponent(ContextMenuComponent);
      this.contextMenu.instance.position = p;
      this.contextMenu.instance.contextMenu = this._appContextMenu;

      // register events
      document.addEventListener('click', this.closeContextMenuEventListener);
      document.addEventListener('wheel', this.closeContextMenuEventListener);
      document.addEventListener('contextmenu', this.contextmenuDocumentEventListener);
      document.addEventListener('keydown', this.keyboardDocumentEventListener);
    }
  }

  private destroyContextMenu(): void {
    if (this.contextMenu) {
      // destroy the context menu if open
      this.contextMenu.destroy();
      this.contextMenu = undefined;

      // unregister events
      document.removeEventListener('click', this.closeContextMenuEventListener);
      document.removeEventListener('wheel', this.closeContextMenuEventListener);
      document.removeEventListener('contextmenu', this.contextmenuDocumentEventListener);
      document.removeEventListener('keydown', this.keyboardDocumentEventListener);
    }
  }
}
