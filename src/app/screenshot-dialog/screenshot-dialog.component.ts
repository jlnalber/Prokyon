import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Dialog} from "../dialog/dialog";
import {DrawerService} from "../services/drawer.service";
import {Rect} from "../global/interfaces/rect";

@Component({
  selector: 'app-screenshot-dialog',
  templateUrl: './screenshot-dialog.component.html',
  styleUrls: ['./screenshot-dialog.component.css']
})
export class ScreenshotDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef;
  canvasEl?: HTMLCanvasElement;

  @ViewChild('wrapper') wrapper!: ElementRef;
  wrapperEl?: HTMLDivElement;

  public dialog!: Dialog<ScreenshotDialogComponent>;

  private _range: Rect;

  public get x(): number {
    return this._range.x;
  }

  public set x(value: number) {
    this._range.x = value;
    this.reload();
  }

  public get y(): number {
    return this._range.y;
  }

  public set y(value: number) {
    this._range.y = value;
    this.reload();
  }

  public get width(): number {
    return Math.abs(this._range.width);
  }

  public set width(value: number) {
    this._range.width = Math.abs(value);
    this.reload();
  }

  public get height(): number {
    return Math.abs(this._range.height);
  }

  public set height(value: number) {
    this._range.height = Math.abs(value);
    this.reload();
  }

  private _zoom: number;

  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(value: number) {
    if (value > 0) {
      this._zoom = value;
      this.reload();
    }
  }

  constructor(private readonly drawerService: DrawerService) {
    this._range = drawerService.renderingContext.range;
    this._zoom = drawerService.zoom;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement as HTMLCanvasElement;
    this.wrapperEl = this.wrapper.nativeElement as HTMLDivElement;
    this.reload();
  }

  download() {
    // first, draw to canvas
    const canvas = document.createElement('canvas');
    this.drawToCanvas(canvas);

    // then download the canvas
    const link = document.createElement('a');
    link.download = 'export.png';
    link.href = canvas.toDataURL();
    link.click();

    this.dialog.close();
  }

  private drawToCanvas(canvas: HTMLCanvasElement): void {
    this.drawerService.drawToCanvas(canvas, {
      x: 0,
      y: 0,
      width: this.width * this.zoom,
      height: this.height * this.zoom
    }, {
      translateX: -this.x,
      translateY: -this.y,
      zoom: this.zoom
    });
  }

  reload() {
    if (this.canvasEl) {
      this.drawToCanvas(this.canvasEl);
    }
  }
}
