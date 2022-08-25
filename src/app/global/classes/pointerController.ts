import {Point} from "../interfaces/point";
import {getPosFromEvent} from "../essentials/utils";
import Cache from "../essentials/cache";

export interface PointerControllerEvents {
  pointerStart?: (p: Point, context: PointerContext) => void,
  pointerMove?: (from: Point, to: Point, context: PointerContext) => void,
  pointerEnd?: (p: Point, context: PointerContext) => void,
  click?: (p: Point, context: PointerContext) => void,
  scroll?: (p: Point, delta: number) => void,
  pinchZoom?: (p: Point, factor: number) => void
}

export interface PointerContext {
  id: number,
  pointerCount: number,
  ctrlKey: boolean,
  moveEventsFired?: number
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
    'pointercancel',
    'pointerout'
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

  // this cache stores the last point to the pointer id
  private pointerCache: Cache<number, Point> = new Cache<number, Point>();
  // this cache stores the amount of move events fired with the given pointer id
  private pointerMoveCountCache: Cache<number, number> = new Cache<number, number>();

  private getPointerContext(e: PointerEvent): PointerContext {
    return {
      id: e.pointerId,
      pointerCount: this.pointerCache.size,
      ctrlKey: e.ctrlKey,
      moveEventsFired: this.pointerMoveCountCache.getItem(e.pointerId)
    }
  }

  // Events for mouse (stylus, touch) movement
  private startEvent = (e: PointerEvent | Event) => {
    if (e instanceof PointerEvent) {
      let p = getPosFromEvent(e, this.element);

      // register the pointer on the pointerCaches
      this.pointerCache.setItem(e.pointerId, p);
      this.pointerMoveCountCache.setItem(e.pointerId, 0);

      // fire event
      if (this.pointerControllerEvents.pointerStart) {
        this.pointerControllerEvents.pointerStart(p, this.getPointerContext(e));
      }
    }
  }

  private moveEvent = (e: PointerEvent | Event) => {
    if (e instanceof PointerEvent) {
      let p = getPosFromEvent(e, this.element);

      // count up the amount of pointer move events fired on the pointer
      if (this.pointerMoveCountCache.hasKey(e.pointerId)) {
        this.pointerMoveCountCache.setItem(e.pointerId, this.pointerMoveCountCache.getItem(e.pointerId)! + 1);
      }

      // trigger the move event on the pointer
      if (this.pointerCache.hasKey(e.pointerId)) {
        if (this.pointerControllerEvents.pointerMove) {
          this.pointerControllerEvents.pointerMove(this.pointerCache.getItem(e.pointerId)!, p, this.getPointerContext(e));
        }
        this.pointerCache.setItem(e.pointerId, p);
      }
    }
  }

  private endEvent = (e: PointerEvent | Event) => {
    if (e instanceof PointerEvent) {
      let p = getPosFromEvent(e, this.element);
      let pointerContext = this.getPointerContext(e);

      // first, fire pointerEnd event
      if (this.pointerControllerEvents.pointerEnd && this.pointerCache.hasKey(e.pointerId)) {
        this.pointerControllerEvents.pointerEnd(p, pointerContext);
      }

      // then, fire click event
      if (this.pointerControllerEvents.click && this.pointerMoveCountCache.getItem(e.pointerId) === 0) {
        this.pointerControllerEvents.click(p, pointerContext);
      }

      // empty the caches
      this.pointerCache.delItem(e.pointerId);
      this.pointerMoveCountCache.delItem(e.pointerId);
    }
  }

  // Event for mouse scrolling
  private mouseWheelHandler = (e: WheelEvent | Event) => {
    if (e instanceof WheelEvent) {
      e.preventDefault();
      let p = getPosFromEvent(e, this.element);
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
        this.element.addEventListener(start, this.startPinchZoomEvent);
      }
      for (let move of PointerController.moves) {
        this.element.addEventListener(move, this.moveEvent);
        this.element.addEventListener(move, this.movePinchZoomEvent);
      }
      for (let end of PointerController.ends) {
        this.element.addEventListener(end, this.endEvent);
        this.element.addEventListener(end, this.endPinchZoomEvent);
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
      this.pointerCache.empty();
    }
  }

  public end(): void {
    if (this.active) {
      for (let start of PointerController.starts) {
        try {
          this.element.removeEventListener(start, this.startEvent);
        } catch { }
        try {
          this.element.removeEventListener(start, this.startPinchZoomEvent);
        } catch { }
      }
      for (let move of PointerController.moves) {
        try {
          this.element.removeEventListener(move, this.moveEvent);
        } catch { }
        try {
          this.element.removeEventListener(move, this.movePinchZoomEvent);
        } catch { }
      }
      for (let end of PointerController.ends) {
        try {
          this.element.removeEventListener(end, this.endEvent);
        } catch { }
        try {
          this.element.removeEventListener(end, this.endPinchZoomEvent);
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
          } catch { }
        }
      }

      this._active = false;
      this.pointerCache.empty();
    }
  }


  // #region the functions to be executed in the pinch events

  // from mdn: https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html

  // Global vars to cache event state
  private mainTouchEventId: number | undefined;
  private evCache: PointerEvent[] = [];
  private prevDiff = -1;

  private startPinchZoomEvent = (ev: PointerEvent | Event) => {
    if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
      // The pointerdown event signals the start of a touch interaction.
      // This event is cached to support 2-finger gestures
      this.evCache.push(ev);

      if (this.mainTouchEventId == undefined) {
        this.mainTouchEventId = ev.pointerId;
      }
    }
  }

  private movePinchZoomEvent = (ev: PointerEvent | Event) => {
    if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
      // This function implements a 2-pointer horizontal pinch/zoom gesture.

      // Find this event in the cache and update its record with this event
      for (let i = 0; i < this.evCache.length; i++) {
        if (ev.pointerId == this.evCache[i].pointerId) {
          this.evCache[i] = ev;
          break;
        }
      }

      // If two pointers are down, check for pinch gestures
      if (this.evCache.length == 2) {
        // Calculate the distance between the two pointers
        let p0 = {
          x: this.evCache[0].clientX as number,
          y: this.evCache[0].clientY as number
        }
        let p1 = {
          x: this.evCache[1].clientX as number,
          y: this.evCache[1].clientY as number
        }
        let curDiff = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));

        const rect = this.element.getBoundingClientRect();
        let averageP = {
          x: (p0.x + p1.x) / 2 - rect.left,
          y: (p0.y + p1.y) / 2 - rect.top
        }

        if (this.prevDiff > 0 && curDiff > 0 && this.pointerControllerEvents.pinchZoom) {
          // zoom to the middle by the amount that was scrolled
          this.pointerControllerEvents.pinchZoom(averageP, curDiff / this.prevDiff);
        }

        // Cache the distance for the next move event
        this.prevDiff = curDiff;
      } else if (this.evCache.length < 2) {
        this.prevDiff = -1;
      }
    }
  }

  private endPinchZoomEvent = (ev: PointerEvent | Event) => {
    if (ev instanceof PointerEvent && ev.pointerType == 'touch') {
      // Remove this pointer from the cache and reset the target's
      // background and border
      this.removeEventPinchZoom(ev);

      // If the number of pointers down is less than two then reset diff tracker
      if (this.evCache.length < 2) {
        this.prevDiff = -1;
      }

      if (this.mainTouchEventId == ev.pointerId) {
        this.mainTouchEventId = undefined;
      }
    }
  }

  private removeEventPinchZoom = (ev: PointerEvent) => {
    // Remove this event from the target's cache
    for (let i = 0; i < this.evCache.length; i++) {
      if (this.evCache[i].pointerId == ev.pointerId) {
        this.evCache.splice(i, 1);
        break;
      }
    }
  }
}
