import {ComponentRef, Directive, Input, Type, ViewContainerRef} from '@angular/core';
import {HoverMenuComponent} from "./hover-menu/hover-menu.component";
import {isIn} from "../global/essentials/utils";
import {Point} from "../global/interfaces/point";

@Directive({
  selector: '[appHoverMenu]'
})
export class HoverMenuDirective {

  private hoverMenu?: ComponentRef<HoverMenuComponent>;

  @Input() public appHoverMenu!: HoverConfiguration;
  private readonly element: Element;

  constructor(private readonly vc: ViewContainerRef) {
    this.element = vc.element.nativeElement as Element;

    this.element.addEventListener('mouseover', this.eventListenerStart);
    this.element.addEventListener('mouseleave', this.eventListenerEnd);

  }

  private eventListenerStart = (event: Event | MouseEvent) => {
    if (!this.hoverMenu && event instanceof MouseEvent) {
      this.hoverMenu = this.vc.createComponent(HoverMenuComponent);

      // give data to this.hoverMenu
      this.hoverMenu.instance.component = this.appHoverMenu.component;
      this.hoverMenu.instance.data = this.appHoverMenu.data;
      let rect = this.element.getBoundingClientRect();
      this.hoverMenu.instance.position = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      }

      // add events
      this.hoverMenu.location.nativeElement.addEventListener('mouseleave', this.eventListenerEnd);
    }
  }

  private eventListenerEnd = (event: Event | MouseEvent) => {
    // stop hovering when not over it anymore
    if (this.hoverMenu && event instanceof MouseEvent) {
      let p: Point = {
        x: event.clientX,
        y: event.clientY
      }
      const tolerance = 0;
      if ((!isIn(p, this.element.getBoundingClientRect(), tolerance) || event.target == this.element)
        && (!isIn(p, this.hoverMenu.instance.getBoundingClientRect(), tolerance) || event.target == this.hoverMenu.location.nativeElement)) {
        this.hoverMenu.destroy();
        this.hoverMenu = undefined;
      }
    }
  }

}

export interface HoverConfiguration {
  component: Type<any>,
  data: any
}
