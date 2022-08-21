import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {PointerController} from "../global/classes/pointerController";
import {Point} from "../global/interfaces/point";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef;
  canvasEl?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  @ViewChild('wrapper') wrapper!: ElementRef;
  wrapperEl?: HTMLDivElement;

  constructor(private readonly drawerService: DrawerService) {
    this.drawerService.canvas = this;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    this.wrapperEl = this.wrapper.nativeElement as HTMLDivElement;
    this.ctx = this.canvasEl?.getContext('2d') as CanvasRenderingContext2D | undefined;
    new ResizeObserver(() => {
      this.drawerService.redraw();
    }).observe(this.canvasEl);
    new PointerController(this.canvasEl, {
      pointerMove: (from: Point, to: Point) => {
        this.drawerService.translateX += (to.x - from.x) / this.drawerService.zoom;
        this.drawerService.translateY -= (to.y - from.y) / this.drawerService.zoom;
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

    /*this.drawerService.addCanvasElement(new Graph(new Func(new Multiplication(new Variable('x'), new Variable('x'))), {
      r: 0,
      g: 0,
      b: 255
    }))

    this.drawerService.addCanvasElement(new Graph(new Func(new Variable('x')), {
      r: 0,
      g: 255,
      b: 0
    }))

    this.drawerService.addCanvasElement(new Graph(new Func(new Secans(new Variable('x'))), {
      r: 255,
      g: 0,
      b: 0
    }))

    this.drawerService.addCanvasElement(new Graph(new Func(new Arcussinus(new Variable('x'))), {
      r: 155,
      g: 115,
      b: 89
    }))

    this.drawerService.addCanvasElement(new Graph(new Func(new Arcustangens(new Variable('x'))), {
      r: 255,
      g: 0,
      b: 255
    }))

    this.drawerService.addCanvasElement(new Graph(new Func(new Subtraction(new Pow(new Cosinus(new Variable('x')), new Constant(5)), new Pow(new Sinus(new Variable('x')), new Constant(3)))), {
      r: 0,
      g: 255,
      b: 255
    }))

    this.drawerService.addCanvasElement(new Graph(new Func(new Division(new Constant(1), new Variable('x'))), {
      r: 0,
      g: 255,
      b: 255
    }, false))

    this.drawerService.addCanvasElement(new Graph(new Func(new Pow(new Constant(Math.E), new Variable('x'))), {
      r: 35,
      g: 125,
      b: 212
    }, false))

    this.drawerService.addCanvasElement(new Graph(new Func(new Root(new Variable('x'), new Constant(1 / 3))), {
      r: 35,
      g: 125,
      b: 212
    }, true))

    this.drawerService.addCanvasElement(new Graph(new Func(new OperationsCompiler('(5.8x**(1/2)+2*4+3*(-3(4)+8))%1').compile()), {
      r: 0,
      g: 0,
      b: 0
    }));

    this.drawerService.addCanvasElement(new Graph(new Func(new OperationsCompiler('-x').compile()), {
      r: 0,
      g: 0,
      b: 0
    }));

    this.drawerService.addCanvasElement(new Graph(new Func(new OperationsCompiler('-(x - 3)(x + 5)').compile()), {
      r: 0,
      g: 0,
      b: 0
    }));

    this.drawerService.addCanvasElement(new Graph(new Func(new ConditionalOperation([
      (dict: any) => {
        return dict['x'] < 0;
      },
      new Constant(-1)
    ], [
      (dict: any) => {
        return dict['x'] > 0;
      },
      new Constant(1)
    ], [
      (dict: any) => {
        return dict['x'] == 0;
      },
        new Constant(0)
      ])), {
      r: 212,
      g: 35,
      b: 125
    }))*/

    this.drawerService.redraw();
  }

}
