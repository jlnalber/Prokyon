import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {PointerContext, PointerController} from "../global/classes/pointerController";
import {Point} from "../global/interfaces/point";

// This component is responsible for providing a canvas for the graphs.

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef;
  canvasEl?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  @ViewChild('wrapper') wrapper!: ElementRef;
  wrapperEl?: HTMLDivElement;

  constructor(private readonly drawerService: DrawerService) {
    this.drawerService.canvas = this;
  }

  ngAfterViewInit() {
    // Get the HTMLElements.
    this.canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    this.wrapperEl = this.wrapper.nativeElement as HTMLDivElement;
    this.ctx = this.canvasEl?.getContext('2d') as CanvasRenderingContext2D | undefined;

    // Listen for resizing
    window.onresize = () => {
      this.drawerService.redraw();
    }

    // Listen for resizing
    /*new ResizeObserver(() => {
      this.drawerService.redraw();
    }).observe(this.canvasEl);*/

    // Listen for pointer events. They then trigger zoom and translate behaviour on the drawer service
    new PointerController(this.canvasEl, {
      pointerMove: (from: Point, to: Point, context: PointerContext) => {
        this.drawerService.translateX += (to.x - from.x) / this.drawerService.zoom / context.pointerCount;
        this.drawerService.translateY -= (to.y - from.y) / this.drawerService.zoom / context.pointerCount;
      },
      click: (p: Point, context: PointerContext) => {
        this.drawerService.setSelection(p, !context.ctrlKey);
      },
      scroll: (p: Point, delta: number) => {
        if (delta != 0) {
          delta *= -1 / 120;
          delta += Math.sign(delta);
          let factor = delta > 0 ? delta : 1 / -delta;
          this.drawerService.zoomToBy(p, factor);
        }
      },
      pinchZoom: (p: Point, factor: number) => {
        this.drawerService.zoomToBy(p, factor);
    }
    });

    // Initial drawing.
    this.drawerService.redraw();
  }

}
