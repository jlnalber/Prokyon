import AbstractLine, {ABCFormLine, PointsProvider} from "./abstractLine";
import {RenderingContext} from "../renderingContext";
import {GeometricFormulaComponent} from "../../../formula-tab/geometric-formula/geometric-formula.component";
import {Type} from "@angular/core";
import {Point} from "../../interfaces/point";
import {areEqualPoints, correctRect, isIn, isInRange} from "../../essentials/utils";
import {Color, colorAsTransparent, GREY} from "../../interfaces/color";
import {LINE_WIDTH_SELECTED_RATIO, TRANSPARENCY_RATIO} from "./graph";
import {CanvasElement} from "../abstract/canvasElement";
import {CanvasElementSerialized} from "../../essentials/serializer";
import {DrawerService} from "../../../services/drawer.service";
import PointElement from "./pointElement";
import {
  getAngleBisector,
  getBisectionByLineSegment,
  getBisectionByPoints, getIntersectionPointLines,
  getOrthogonalToLineThroughPoint, getParallelToLineThroughPoint, getTangens, getTwoPointsFromABCFormLine
} from "../../essentials/geometryUtils";
import LineSegmentElement from "./lineSegmentElement";
import CircleElement from "./circleElement";
import {Rect} from "../../interfaces/rect";

const ANGLE_BISECTOR_SUBTYPE = 'angle_bisector';
const BISECTION_SUBTYPE = 'bisection';
const CONNECTION_SUBTYPE = 'connection';
const ORTHOGONAL_SUBTYPE = 'orthogonal';
const PARALLEL_SUBTYPE = 'parallel';
const TANGENS_SUBTYPE = 'tangens';

type SubTypeAndData = {
  subType: string
} & Data

type Data = {
  els: number[],
  index?: number
}

export default class LineElement extends AbstractLine {
  readonly componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;

  public draw(ctx: RenderingContext): void {
    const point1 = this.point1;
    const point2 = this.point2;

    if (point1 !== undefined && point2 !== undefined && !areEqualPoints(point1, point2)) {
      const range = ctx.range;
      const abc = this.getABCFormLine() as ABCFormLine;
      let pS: Point;
      let pE: Point;

      // calculate the points where the line intersects the view port
      if (abc.a === 0) {
        pS = {
          x: range.x,
          y: abc.c / abc.b
        }
        pE = {
          x: range.x + range.width,
          y: abc.c / abc.b
        }
      } else if (abc.a > abc.b || abc.b === 0) {
        pS = {
          x: (abc.c - abc.b * range.y) / abc.a,
          y: range.y
        }
        pE = {
          x: (abc.c - abc.b * (range.y + range.height)) / abc.a,
          y: range.y + range.height
        }
      } else {
        pS = {
          x: range.x,
          y: (abc.c - abc.a * range.x) / abc.b
        }
        pE = {
          x: range.x + range.width,
          y: (abc.c - abc.a * (range.x + range.width)) / abc.b
        }
      }

      if (ctx.selection.indexOf(this) !== -1) {
        ctx.drawPath([pS, pE], this.lineWidth * LINE_WIDTH_SELECTED_RATIO, colorAsTransparent(this._color, TRANSPARENCY_RATIO), undefined, this.configuration.dashed);
      }
      ctx.drawPath([pS, pE], this.lineWidth, this.color, undefined, this.configuration.dashed);
    }
  }

  public override getPositionForLabel(rtx: RenderingContext): Point | undefined {
    const range = correctRect(rtx.range);
    const depos = 50 / rtx.zoom;
    const abc = this.getABCFormLine();

    if (abc === undefined) {
      return undefined;
    }

    const rect: Rect = {
      x: range.x + depos,
      y: range.y + depos,
      width: range.width - 2 * depos,
      height: range.height - 2 * depos
    }

    const iPointBottom = getIntersectionPointLines(abc, {
      a: 0,
      b: 1,
      c: rect.y
    })
    const iPointTop = getIntersectionPointLines(abc, {
      a: 0,
      b: 1,
      c: rect.y + rect.height
    })
    const inRangeTop = iPointTop !== undefined && isInRange(iPointTop.x, rect.x, rect.x + rect.width);
    const iPointRight = getIntersectionPointLines(abc, {
      a: 1,
      b: 0,
      c: rect.x + rect.width
    })
    const inRangeBottom = iPointBottom !== undefined && isInRange(iPointBottom.x, rect.x, rect.x + rect.width);

    if (iPointRight !== undefined && isInRange(iPointRight.y, rect.y, rect.y + rect.height)) {
      return iPointRight;
    } else if (inRangeTop && inRangeBottom) {
      if (iPointTop!.x > iPointBottom!.x) {
        return iPointTop;
      } else {
        return iPointBottom;
      }
    } else if (inRangeTop) {
      return iPointTop;
    } else if (inRangeBottom) {
      return iPointBottom;
    }
    return undefined;
  }

  constructor(psProvider: PointsProvider,
              dependencies: CanvasElement[],
              protected subTypeAndDataProvider: () => SubTypeAndData,
              color: Color = {r: 0, g: 0, b: 0},
              formula?: string,
              visible: boolean = true,
              lineWidth: number = 3,
              showLabel: boolean = true) {
    super(psProvider, dependencies, color, formula, visible, lineWidth, showLabel);
  }

  public static createAngleBisector(center: PointElement, p1: PointElement, p2: PointElement): LineElement {
    return new LineElement(() => {
      return getAngleBisector(center.point, p1.point, p2.point);
    }, [center, p1, p2], () => {
      return {
        subType: ANGLE_BISECTOR_SUBTYPE,
        els: [
          center.id,
          p1.id,
          p2.id
        ]
      }
    }, GREY, 'Winkelhalbierende')
  }

  public static createBisectionByPoints(p1: PointElement, p2: PointElement): LineElement {
    return new LineElement(() => {
      return getBisectionByPoints(p1.point, p2.point);
    }, [p1, p2], () => {
      return {
        subType: BISECTION_SUBTYPE,
        els: [
          p1.id,
          p2.id
        ]
      }
    }, GREY, 'Mittelsenkrechte')
  }

  public static createBisectionByLineSegment(lineSegment: LineSegmentElement): LineElement {
    return new LineElement(() => {
      return getBisectionByLineSegment(lineSegment);
    }, [lineSegment], () => {
      return {
        subType: BISECTION_SUBTYPE,
        els: [lineSegment.id]
      }
    }, GREY, 'Mittelsenkrechte')
  }

  public static createConnection(p1: PointElement, p2: PointElement): LineElement {
    return new LineElement(() => [p1.point, p2.point], [p1, p2], () => {
      return {
        subType: CONNECTION_SUBTYPE,
        els: [
          p1.id,
          p2.id
        ]
      }
    }, GREY, 'Verbindungsgerade')
  }

  public static createOrthogonal(p: PointElement, l: AbstractLine) {
    return new LineElement((): [undefined | Point, undefined | Point] => {
      const abcPLine = l.getABCFormLine();
      const point = p.point;
      if (abcPLine === undefined || point === undefined) {
        return [undefined, undefined]
      }
      const abcLine = getOrthogonalToLineThroughPoint(abcPLine, point);

      // check whether the point is actually in the line segment
      if (l instanceof LineSegmentElement) {
        const iPoint = getIntersectionPointLines(abcPLine, abcLine);
        const p1 = l.point1;
        const p2 = l.point2;
        if (iPoint === undefined || p1 === undefined || p2 === undefined) return [undefined, undefined];
        if (!(isInRange(iPoint.x, p1.x, p2.x) && isInRange(iPoint.y, p1.y, p2.y))) return [undefined, undefined];
      }

      return getTwoPointsFromABCFormLine(abcLine) ?? [undefined, undefined]
    }, [p, l], () => {
      return {
        subType: ORTHOGONAL_SUBTYPE,
        els: [
          p.id,
          l.id
        ]
      }
    }, GREY, 'Lot');
  }

  public static createParallel(p: PointElement, l: AbstractLine): LineElement {
    return new LineElement((): [undefined | Point, undefined | Point] => {
      const abcPLine = l.getABCFormLine();
      const point = p.point;
      return getParallelToLineThroughPoint(abcPLine, point);
    }, [p, l], () => {
      return {
        subType: PARALLEL_SUBTYPE,
        els: [
          p.id,
          l.id
        ]
      }
    }, GREY, 'Parallele');
  }

  public static createTangens(p: PointElement, c: CircleElement): [LineElement, LineElement] {
    return [
      new LineElement(() => {
        return getTangens(p.point, c.point, c.radius)[0];
      }, [p, c], () => {
        return {
          subType: TANGENS_SUBTYPE,
          els: [
            p.id,
            c.id
          ],
          index: 0
        }
      }, GREY, 'Tangente'),
      new LineElement(() => {
        return getTangens(p.point, c.point, c.radius)[1];
      }, [p, c], () => {
        return {
          subType: TANGENS_SUBTYPE,
          els: [
            p.id,
            c.id
          ],
          index: 1
        }
      }, GREY, 'Tangente')
    ];
  }

  public static getDefaultInstance(): LineElement {
    return new LineElement(() => [undefined, undefined], [], () => {
      return {
        subType: '',
        els: []
      }
    })
  }

  public override serialize(): CanvasElementSerialized {
    const subTypeAndData = this.subTypeAndDataProvider();
    const data = {
      els: subTypeAndData.els,
      index: subTypeAndData.index
    }
    return {
      data,
      subType: subTypeAndData.subType,
      style: {
        color: this.color,
        size: this.lineWidth,
        visible: this.visible
      }
    }
  }

  public override loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService) {
    const data: Data = canvasElementSerialized.data;

    // first, load the elements
    const els: (CanvasElement | undefined)[] = [];
    for (let i of data.els) {
      const el = canvasElements[i];
      if (el !== undefined) this.addDependency(el);
      els.push(el);
    }

    // then, load the style
    this.color = canvasElementSerialized.style.color;
    this.visible = canvasElementSerialized.style.visible;
    this.lineWidth = canvasElementSerialized.style.size ?? this.lineWidth;

    let l: LineElement;

    // then, load the rest (with the subtype)
    if (canvasElementSerialized.subType === ANGLE_BISECTOR_SUBTYPE
      && els.length === 3
      && els[0] instanceof PointElement
      && els[1] instanceof PointElement
      && els[2] instanceof PointElement) {
      l = LineElement.createAngleBisector(els[0] as PointElement, els[1] as PointElement, els[2] as PointElement);
    } else if (canvasElementSerialized.subType === BISECTION_SUBTYPE) {
      if (els.length === 1 && els[0] instanceof LineSegmentElement) {
        l = LineElement.createBisectionByLineSegment(els[0] as LineSegmentElement);
      } else if (els.length === 2 && els[0] instanceof PointElement && els[1] instanceof PointElement) {
        l = LineElement.createBisectionByPoints(els[0] as PointElement, els[1] as PointElement);
      } else {
        return;
      }
    } else if (canvasElementSerialized.subType === CONNECTION_SUBTYPE
      && els.length === 2
      && els[0] instanceof PointElement
      && els[1] instanceof PointElement) {
      l = LineElement.createConnection(els[0] as PointElement, els[1] as PointElement);
    } else if (canvasElementSerialized.subType === ORTHOGONAL_SUBTYPE
      && els.length === 2
      && els[0] instanceof PointElement
      && els[1] instanceof AbstractLine) {
      l = LineElement.createOrthogonal(els[0] as PointElement, els[1] as AbstractLine);
    } else if (canvasElementSerialized.subType === PARALLEL_SUBTYPE
      && els.length === 2
      && els[0] instanceof PointElement
      && els[1] instanceof AbstractLine) {
      l = LineElement.createParallel(els[0] as PointElement, els[1] as AbstractLine);
    } else if (canvasElementSerialized.subType === TANGENS_SUBTYPE
      && els.length === 2
      && els[0] instanceof PointElement
      && els[1] instanceof CircleElement) {
      l = LineElement.createTangens(els[0] as PointElement, els[1] as CircleElement)[data.index ?? 0];
    } else {
      return;
    }

    this.pointsProvider = l.pointsProvider;
    this.subTypeAndDataProvider = l.subTypeAndDataProvider;
  }
}
