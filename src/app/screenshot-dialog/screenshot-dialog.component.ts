import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Dialog} from "../dialog/dialog";
import {DrawerService} from "../services/drawer.service";
import {Rect} from "../global/interfaces/rect";

const SESSION_RANGE = 'screenshot_range';
const SESSION_ZOOM = 'screenshot_zoom';

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

  private _range: Rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  public get x(): number {
    return this._range.x;
  }

  public set x(value: number) {
    this._range.x = value;
    this.save();
    this.reload();
  }

  public get y(): number {
    return this._range.y;
  }

  public set y(value: number) {
    this._range.y = value;
    this.save();
    this.reload();
  }

  public get width(): number {
    return Math.abs(this._range.width);
  }

  public set width(value: number) {
    this._range.width = Math.abs(value);
    this.save();
    this.reload();
  }

  public get height(): number {
    return Math.abs(this._range.height);
  }

  public set height(value: number) {
    this._range.height = Math.abs(value);
    this.save();
    this.reload();
  }

  private _zoom: number = 1;

  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(value: number) {
    if (value > 0) {
      this._zoom = value;
      this.save();
      this.reload();
    }
  }

  constructor(private readonly drawerService: DrawerService) {
    this.load();
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
  
  reset() {
    sessionStorage.removeItem(SESSION_RANGE);
    sessionStorage.removeItem(SESSION_ZOOM);
    this.load();
  }

  private load() {
    if (sessionStorage[SESSION_RANGE]) {
      this._range = JSON.parse(sessionStorage[SESSION_RANGE]) as Rect ?? this.drawerService.renderingContext.range;
    }
    else {
      this._range = this.drawerService.renderingContext.range;
    }
    if (sessionStorage[SESSION_ZOOM]) {
      this._zoom = JSON.parse(sessionStorage[SESSION_ZOOM]) as number ?? this.drawerService.zoom;
    }
    else {
      this._zoom = this.drawerService.zoom;
    }
    this.reload();
  }

  private save() {
    sessionStorage[SESSION_RANGE] = JSON.stringify(this._range);
    sessionStorage[SESSION_ZOOM] = JSON.stringify(this._zoom);
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
