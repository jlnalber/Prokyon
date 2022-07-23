import { Component, OnInit } from '@angular/core';
import {ContextMenu, ContextMenuElement} from "../context-menu.directive";
import {Point} from "../../global/interfaces/point";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  public contextMenu: ContextMenu = {
    elements: []
  }
  public position: Point = {
    x: 0,
    y: 0
  }

  constructor() { }

  ngOnInit(): void {
  }

  click(event: Event, element: ContextMenuElement) {
    if (!element.disabled && element.click) {
      element.click(event);
    }
  }

  onTabKeyboard(event: KeyboardEvent, element: ContextMenuElement) {
    if (event.key == 'Enter' || event.key == ' ') {
      this.click(event, element);
    }
  }
}
