import PointElement from "./pointElement";
import {Point} from "../../interfaces/point";
import {BLACK, Color, GREY} from "../../interfaces/color";
import {CanvasElement} from "../abstract/canvasElement";
import {CanvasElementSerialized} from "../../essentials/serializer";
import {DrawerService} from "../../../services/drawer.service";
import {
  getIntersectionPointCircles,
  getIntersectionPointLineAndCircle,
  getIntersectionPointLines,
  getMiddlePointByLineSegment,
  getMiddlePointByPoints
} from "../../essentials/geometryUtils";
import LineSegmentElement from "./lineSegmentElement";
import AbstractLine from "./abstractLine";
import CircleElement from "./circleElement";
import {isInRange} from "../../essentials/utils";

const INTERSECTION_POINT_SUBTYPE = 'intersection_point';
const MIDDLE_POINT_SUBTYPE = 'middle_point';

type Data = {
  el1: number,
  el2?: number,
  index?: number
}

type SubTypeAndData = {
  subType: string
} & Data

export default class DynamicPointElement extends PointElement {

  protected _pointProvider: PointProvider;

  protected _tempPoint: Point | undefined;

  public override get x(): number | undefined {
    if (this._tempPoint === undefined) {
      this._tempPoint = this._pointProvider();
    }
    return this._tempPoint?.x;
  }

  public override get y(): number | undefined {
    if (this._tempPoint === undefined) {
      this._tempPoint = this._pointProvider();
    }
    return this._tempPoint?.y;
  }

  public get pointProvider(): PointProvider {
    return this._pointProvider;
  }

  public set pointProvider(value: PointProvider) {
    this._pointProvider = value;
    this.onChange.emit(value);
  }

  constructor(pointProvider: PointProvider,
              dependencies: CanvasElement[],
              private subTypeAndDataProvider: () => SubTypeAndData,
              color: Color = BLACK,
              name?: string,
              visible: boolean = true) {
    super({x: 0, y: 0}, color, true, dependencies, visible);
    this._pointProvider = pointProvider;
  }

  public static createMiddlePointByPoints(p1: PointElement, p2: PointElement): DynamicPointElement {
    return new DynamicPointElement(() => {
      return getMiddlePointByPoints(p1.point, p2.point);
    }, [p1, p2], () => {
      return {
        subType: MIDDLE_POINT_SUBTYPE,
        el1: p1.id,
        el2: p2.id
      }
    }, GREY);
  }

  public static createMiddlePointByLineSegment(l: LineSegmentElement): DynamicPointElement {
    return new DynamicPointElement(() => {
      return getMiddlePointByLineSegment(l);
    }, [l], () => {
      return {
        subType: MIDDLE_POINT_SUBTYPE,
        el1: l.id
      }
    }, GREY);
  }

  public static createIntersectionPoints(el1: AbstractLine | CircleElement, el2: AbstractLine | CircleElement): DynamicPointElement[] {
    // case: line and line
    if (el1 instanceof AbstractLine && el2 instanceof AbstractLine) {
      return [new DynamicPointElement(() => {
        const abcLine1 = (el1 as AbstractLine).getABCFormLine();
        const abcLine2 = (el2 as AbstractLine).getABCFormLine();
        if (abcLine1 === undefined || abcLine2 === undefined) {
          return undefined;
        }

        const iPoint = getIntersectionPointLines(abcLine1, abcLine2);

        if (iPoint === undefined) return undefined;

        // check whether the point is actually in the line segment
        if (el1 instanceof LineSegmentElement) {
          const p1 = el1.point1;
          const p2 = el1.point2;
          if (p1 === undefined || p2 === undefined) return undefined;
          if (!(isInRange(iPoint.x, p1.x, p2.x) && isInRange(iPoint.y, p1.y, p2.y))) return undefined;
        }
        if (el2 instanceof LineSegmentElement) {
          const p1 = el2.point1;
          const p2 = el2.point2;
          if (p1 === undefined || p2 === undefined) return undefined;
          if (!(isInRange(iPoint.x, p1.x, p2.x) && isInRange(iPoint.y, p1.y, p2.y))) return undefined;
        }

        return iPoint
      }, [el1, el2], () => {
        return {
          subType: INTERSECTION_POINT_SUBTYPE,
          el1: el1.id,
          el2: el2.id
        }
      }, GREY)];
    }

    // switch circle and line
    if (el1 instanceof CircleElement && el2 instanceof AbstractLine) {
      const temp = el1;
      el1 = el2;
      el2 = temp;
    }
    // case: line and a circle
    if (el1 instanceof AbstractLine && el2 instanceof CircleElement) {
      const provider = (i: 0 | 1) => () => {
        const abc = (el1 as AbstractLine).getABCFormLine();
        const center = (el2 as CircleElement).point;
        const radius = (el2 as CircleElement).radius;
        if (abc === undefined || center === undefined || radius === undefined) {
          return undefined
        }
        const iPoint = getIntersectionPointLineAndCircle(abc, center, radius)[i];
        if (iPoint === undefined) return undefined;

        if (el1 instanceof LineSegmentElement) {
          const point1 = el1.point1;
          const point2 = el1.point2;
          if (point1 === undefined || point2 === undefined) return undefined;

          return (isInRange(iPoint.x, point1.x, point2.x) && isInRange(iPoint.y, point1.y, point2.y)) ? iPoint : undefined;
        } else {
          return iPoint;
        }
      }

      return [
        new DynamicPointElement(provider(0), [el1, el2], () => {
          return {
            subType: INTERSECTION_POINT_SUBTYPE,
            el1: el1.id,
            el2: el2.id,
            index: 0
          }
        }, GREY),
        new DynamicPointElement(provider(1), [el1, el2], () => {
          return {
            subType: INTERSECTION_POINT_SUBTYPE,
            el1: el1.id,
            el2: el2.id,
            index: 1
          }
        }, GREY)
      ]
    }

    // case: circle and circle
    if (el1 instanceof CircleElement && el2 instanceof CircleElement) {
      const provider = (i: number) => (): undefined | Point => {
        const center1 = (el1 as CircleElement).point;
        const radius1 = (el1 as CircleElement).radius;
        const center2 = (el2 as CircleElement).point;
        const radius2 = (el2 as CircleElement).radius;

        if (center1 === undefined || radius1 === undefined || center2 === undefined || radius2 === undefined) {
          return undefined;
        }

        return getIntersectionPointCircles(center1, radius1, center2, radius2)[i];
      }

      return [
        new DynamicPointElement(provider(0), [el1, el2], () => {
          return {
            subType: INTERSECTION_POINT_SUBTYPE,
            el1: el1.id,
            el2: el2.id,
            index: 0
          }
        }, GREY),
        new DynamicPointElement(provider(1), [el1, el2], () => {
          return {
            subType: INTERSECTION_POINT_SUBTYPE,
            el1: el1.id,
            el2: el2.id,
            index: 1
          }
        }, GREY)
      ]
      //drawerService.addCanvasElements(new DynamicPointElement(provider(2), GREY));
      //drawerService.addCanvasElements(new DynamicPointElement(provider(3), GREY));
    }

    return [];
  }

  public static override getDefaultInstance(): DynamicPointElement {
    return new DynamicPointElement(() => undefined, [], () => {
      return {
        subType: '',
        el1: -1
      }
    })
  }

  public override serialize(): CanvasElementSerialized {
    const dataAndSubType = this.subTypeAndDataProvider();
    const data: Data = {
      el1: dataAndSubType.el1,
      el2: dataAndSubType.el2,
      index: dataAndSubType.index
    }

    return {
      data,
      subType: dataAndSubType.subType,
      style: {
        color: this.color,
        size: this.radius,
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        visible: this.visible
      }
    };
  }

  public override loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService) {
    const data: Data = canvasElementSerialized.data as Data;
    const el1 = canvasElements[data.el1];
    const el2 = data.el2 === undefined ? undefined : canvasElements[data.el2];
    if (el1 !== undefined) this.addDependency(el1);
    if (el2 !== undefined) this.addDependency(el2);

    this.loadStyle(canvasElementSerialized.style);

    // load according to the subtype
    if (canvasElementSerialized.subType === MIDDLE_POINT_SUBTYPE) {
      if (el1 instanceof PointElement && el2 instanceof PointElement) {
        const d = DynamicPointElement.createMiddlePointByPoints(el1, el2);
        this.pointProvider = d.pointProvider;
        this.subTypeAndDataProvider = d.subTypeAndDataProvider;
      } else if (el1 instanceof LineSegmentElement) {
        const d = DynamicPointElement.createMiddlePointByLineSegment(el1);
        this.pointProvider = d.pointProvider;
        this.subTypeAndDataProvider = d.subTypeAndDataProvider;
      }
    } else if (canvasElementSerialized.subType === INTERSECTION_POINT_SUBTYPE
      && (el1 instanceof AbstractLine || el1 instanceof CircleElement)
      && (el2 instanceof AbstractLine || el2 instanceof CircleElement)) {
      const d = DynamicPointElement.createIntersectionPoints(el1, el2)[data.index ?? 0];
      this.pointProvider = d.pointProvider;
      this.subTypeAndDataProvider = d.subTypeAndDataProvider;
    }
  }

  protected override resetTempListener = () => {
    this._tempPoint = undefined;
  }
}

type PointProvider = () => (Point | undefined);
