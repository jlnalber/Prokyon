import {Point} from "../interfaces/point";
import {getPosFromPointerEvent, getPosFromWheelEvent} from "../essentials/utils";

export interface PointerControllerEvents {
  pointerStart?: (p: Point) => void,
  pointerMove?: (from: Point, to: Point) => void,
  pointerEnd?: (p: Point) => void,
  scroll?: (p: Point, delta: number) => void
}

export class PointerController {

  private _active: boolean = false;
  public get active(): boolean {
    return this._active;
  }

  private static readonly starts: string[] = [
    'pointerdown'
  ]
  private static readonly moves: string[] = [
    'pointermove'
  ]
  private static readonly ends: string[] = [
    'pointerup',
    'pointerleave',
    'pointercancel'
  ]
  private static readonly scrolls: string[] = [
    'wheel'
  ]
  private static readonly prevents: string[] = [
    'pointerdown',
    'pointermove',
    'pointerup',
    'pointerleave',
    'pointercancel',
    'pointerout',
    'pointerover',
    'pointerenter',
    'contextmenu'
  ]

  private lastPoint: Point | undefined = undefined;

  private startEvent = (e: PointerEvent | Event) => {
    if (e instanceof  PointerEvent) {
      let p = getPosFromPointerEvent(e, this.element);
      this.lastPoint = p;
      if (this.pointerControllerEvents.pointerStart) {
        this.pointerControllerEvents.pointerStart(p);
      }
    }
  }

  private moveEvent = (e: PointerEvent | Event) => {
    if (e instanceof PointerEvent) {
      let p = getPosFromPointerEvent(e, this.element);
      if (this.pointerControllerEvents.pointerMove && this.lastPoint) {
        this.pointerControllerEvents.pointerMove(this.lastPoint, p);
      }
      if (this.lastPoint) this.lastPoint = p;
    }
  }

  private endEvent = (e: PointerEvent | Event) => {
    if (e instanceof PointerEvent) {
      let p = getPosFromPointerEvent(e, this.element);
      if (this.pointerControllerEvents.pointerEnd) {
        this.pointerControllerEvents.pointerEnd(p);
      }
      this.lastPoint = undefined;
    }
  }

  private mouseWheelHandler = (e: WheelEvent | Event) => {
    if (e instanceof WheelEvent) {
      e.preventDefault();
      let p = getPosFromWheelEvent(e, this.element);
      let delta = Math.sqrt(e.deltaY ** 2 + e.deltaX ** 2 + e.deltaZ ** 2) * Math.sign((e.deltaX ? e.deltaX : 1) * (e.deltaY ? e.deltaY : 1) * (e.deltaZ ? e.deltaZ : 1));
      if (this.pointerControllerEvents.scroll) {
        this.pointerControllerEvents.scroll(p, delta);
      }
    }
  }

  private preventDefaultEvent = (e: Event) => {
    e.preventDefault();
  }

  constructor(public readonly element: Element, public readonly pointerControllerEvents: PointerControllerEvents, public readonly preventDefault: boolean = true) {
    this.start();
  }

  public start(): void {
    if (!this.active) {
      for (let start of PointerController.starts) {
        this.element.addEventListener(start, this.startEvent);
      }
      for (let move of PointerController.moves) {
        this.element.addEventListener(move, this.moveEvent);
      }
      for (let end of PointerController.ends) {
        this.element.addEventListener(end, this.endEvent);
      }
      for (let scroll of PointerController.scrolls) {
        this.element.addEventListener(scroll, this.mouseWheelHandler);
      }
      if (this.preventDefault) {
        for (let prevent of PointerController.prevents) {
          this.element.addEventListener(prevent, this.preventDefaultEvent);
        }
      }

      this._active = true;
    }
  }

  public end(): void {
    if (this.active) {
      for (let start of PointerController.starts) {
        try {
          this.element.removeEventListener(start, this.startEvent);
        } catch { }
      }
      for (let move of PointerController.moves) {
        try {
          this.element.removeEventListener(move, this.moveEvent);
        } catch { }
      }
      for (let end of PointerController.ends) {
        try {
          this.element.removeEventListener(end, this.endEvent);
        } catch { }
      }
      for (let scroll of PointerController.scrolls) {
        try {
          this.element.removeEventListener(scroll, this.mouseWheelHandler);
        } catch { }
      }
      if (this.preventDefault) {
        for (let prevent of PointerController.prevents) {
          try {
            this.element.removeEventListener(prevent, this.preventDefaultEvent);
          } catch {
          }
        }
      }

      this._active = false;
    }
  }
}
