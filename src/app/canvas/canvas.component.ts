import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {DrawerService, STORAGE_CACHE} from "../services/drawer.service";
import {PointerContext, PointerController} from "../global/classes/pointerController";
import {Point} from "../global/interfaces/point";
import {Serialized} from "../global/essentials/serializer";

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
        const rtx = this.drawerService.renderingContext;
        const fromNew = rtx.transformPointFromCanvasToField(from);
        const toNew: Point = rtx.transformPointFromCanvasToField(to);
        this.drawerService.mode?.pointerMove(this.drawerService, rtx, fromNew, toNew, context);
      },
      click: (p: Point, context: PointerContext) => {
        const rtx = this.drawerService.renderingContext;
        const newP = rtx.transformPointFromCanvasToField(p);
        this.drawerService.mode?.click(this.drawerService, rtx, newP, context);
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


    // load from last session
    try {
      this.drawerService.loadFrom(JSON.parse(localStorage[STORAGE_CACHE]) as Serialized);
    } catch {}

    // Initial drawing.
    this.drawerService.redraw();
  }

}
