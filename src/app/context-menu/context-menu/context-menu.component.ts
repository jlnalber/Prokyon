import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ContextMenu, ContextMenuElement} from "../context-menu.directive";
import {Point} from "../../global/interfaces/point";

// This component is responsible for displaying a context menu (opening and closing is managed by the directive).

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements AfterViewInit {

  @ViewChild('wrapper') wrapper!: ElementRef;
  private wrapperElement?: HTMLDivElement;

  public elements: ContextMenuElement[] = [];

  private _contextMenu: ContextMenu = {
    elements: () => []
  }
  public get contextMenu(): ContextMenu {
    return this._contextMenu;
  }
  public set contextMenu(value: ContextMenu) {
    this._contextMenu = value;
    this.elements = value.elements();
  }

  private _position: Point = {
    x: 0,
    y: 0
  }
  public get position(): Point {
    // if the context menu is on the side of the page (and exceeds it), prevent an "overflow" and position it back
    if (this.wrapperElement) {
      const viewportSize = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      const rectContextMenu = this.wrapperElement.getBoundingClientRect();
      // console.log(rectContextMenu);
      return {
        x: Math.min(this._position.x, viewportSize.width - rectContextMenu.width),
        y: Math.min(this._position.y, viewportSize.height - rectContextMenu.height)
      }
    }

    return this._position;
  }
  public set position(value: Point) {
    this._position = value;
  }

  constructor() { }

  ngAfterViewInit() {
    this.wrapperElement = this.wrapper.nativeElement as HTMLDivElement;
    this.setPosition();
  }

  private setPosition(): void {
    if (this.wrapperElement) {
      const position = this.position;
      this.wrapperElement.style.left = `${position.x}px`;
      this.wrapperElement.style.top = `${position.y}px`;
    }
  }

  click(event: Event, element: ContextMenuElement) {
    // managing a click on an item
    if (!element.disabled && element.click) {
      element.click(event);
    }
  }

  onTabKeyboard(event: KeyboardEvent, element: ContextMenuElement) {
    // managing keyboard events on an item
    if (event.key == 'Enter' || event.key == ' ') {
      this.click(event, element);
    }
  }
}
