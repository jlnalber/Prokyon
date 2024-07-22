import { Color, BLACK, colorAsTransparent, TRANSPARENT } from './../../interfaces/color';
import { Type } from "@angular/core";
import { DrawerService } from "src/app/services/drawer.service";
import { CanvasElementSerialized } from "../../essentials/serializer";
import { CanvasElement } from "../abstract/canvasElement";
import FormulaDialogElement from "../abstract/formulaDialogElement";
import { RenderingContext } from "../renderingContext";
import PointElement from "./pointElement";
import { getPointsDistance } from "../../essentials/geometryUtils";
import { GeometricFormulaComponent } from 'src/app/formula-tab/geometric-formula/geometric-formula.component';
import { ViewAngleElementComponent } from 'src/app/formula-dialogs/view-angle-element/view-angle-element.component';
import { Point } from '../../interfaces/point';
import { LINE_WIDTH_SELECTED_RATIO } from './graph';


interface Data {
    points: number[]
}

export default class AngleElement extends CanvasElement {
    public override componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;
    public override formulaDialogType: Type<FormulaDialogElement> | undefined = ViewAngleElementComponent;

    private _points: PointElement[];

    public get points(): PointElement[] {
        return this._points.slice();
    }

    public set points(value: PointElement[]) {
        this._points = value.slice();
        this.onChange.emit();
    }

    public get size(): number {
        return this._size;
    }

    public set size(value: number) {
        this._size = value;
        this.onChange.emit(value);
    }

    public get lineWidth(): number {
        return this._lineWidth;
    }

    public set lineWidth(value: number) {
        this._lineWidth = value;
        this.onChange.emit(value);
    }

    
    public constructor(points: PointElement[], color: Color = BLACK, visible: boolean = true, private _size: number = 50, private _lineWidth: number = 3, showLabel: boolean = true) {
        super();
        this._color = color;
        this._visible = visible;
        this._points = points;


        this.configuration.formula = 'Winkel'
        this.configuration.showLabel = showLabel;
    }

    public get angle(): number {
        if (this.points.length !== 3) {
            return Number.NaN;
        }

        const A = this.points[0].point;
        const B = this.points[1].point;
        const C = this.points[2].point;

        if (A && B && C) {

            const vec1 = {
                x: A.x - B.x,
                y: A.y - B.y
            }
            const vec2 = {
                x: C.x - B.x,
                y: C.y - B.y
            }
            const o = {
                x: 0,
                y: 0
            }
            

            const cos = (vec1.x * vec2.x + vec1.y * vec2.y) / (getPointsDistance(o, vec1) * getPointsDistance(o, vec2))
            return Math.acos(cos) / Math.PI * 180
        }

        return Number.NaN;
    }

    public get angles(): [number, number] | undefined {
        if (this._points.length === 3) {
            const p1 = this._points[0].point;
            const p2 = this._points[1].point;
            const p3 = this._points[2].point;

            if (p1 !== undefined && p2 !== undefined && p3 !== undefined) {
                const base: Point = {
                    x: 1,
                    y: 0
                }
                const o: Point = {
                    x: 0,
                    y: 0
                }

                const scalarProduct = (v1: Point, v2: Point): number => {
                    return v1.x * v2.x + v1.y * v2.y
                }
                const getAngle = (v1: Point, v2: Point): number => {
                    return Math.acos(scalarProduct(v1, v2) / getPointsDistance(o, v1) / getPointsDistance(o, v2))
                }

                const v1 = {
                    x: p1.x - p2.x,
                    y: p1.y - p2.y
                }
                const v2 = {
                    x: p3.x - p2.x,
                    y: p3.y - p2.y
                }

                let a1 = getAngle(base, v1);
                let a2 = getAngle(base, v2);

                if (p1.y > p2.y) {
                    a1 = -a1;
                }
                if (p3.y > p2.y) {
                    a2 = -a2;
                }
                
                return [a1, a2]
            }
        }

        return undefined;
    }


    public override serialize(): CanvasElementSerialized {
        return {
          data: {
            points: this.points.map(i => i.id)
          },
          style: {
            color: this.color,
            visible: this.visible,
            size: this.size,
            strokeWidth: this.lineWidth
          }
        }
    }

    public override loadFrom(canvasElements: { [id: number]: CanvasElement | undefined; }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void {
        const data = canvasElementSerialized.data as Data;

        this.points = data.points.map(i => canvasElements[i]).filter(i => i instanceof PointElement) as PointElement[];


        this.color = canvasElementSerialized.style.color;
        this.visible = canvasElementSerialized.style.visible;
        this.lineWidth = canvasElementSerialized.style.strokeWidth ?? this.lineWidth;
        this.size = canvasElementSerialized.style.size ?? this.size;
    }

    public override draw(ctx: RenderingContext): void {
        const angles = this.angles;
        const ps = this._points;
        if (angles && ps.length === 3) {
            const c = ps[1].point;
            if (c !== undefined) {
                ctx.drawCircleSector(c, 
                    this.size / ctx.zoom,
                    colorAsTransparent(this.color, 0.3),
                    this.color,
                    this.lineWidth,
                    angles[1], angles[0], this.configuration.dashed)

                if (ctx.selection.indexOf(this) !== -1) {
                    ctx.drawCircleSector(c, 
                        this.size / ctx.zoom,
                        TRANSPARENT,
                        colorAsTransparent(this.color, 0.3),
                        this.lineWidth * LINE_WIDTH_SELECTED_RATIO,
                        angles[1], angles[0], this.configuration.dashed)
                }
            }
        }
    }

    public static getDefaultInstance(): AngleElement {
        return new AngleElement([]);
    }

    public override getPositionForLabel(rtx: RenderingContext): Point | undefined {
        const dist = this.size / rtx.zoom / 2;
        if (this._points.length === 3) {
            const p1 = this._points[0].point;
            const p2 = this._points[1].point;
            const p3 = this._points[2].point;

            if (p1 !== undefined && p2 !== undefined && p3 !== undefined) {
                const v1 = {
                    x: p1.x - p2.x,
                    y: p1.y - p2.y
                }
                const v2 = {
                    x: p3.x - p2.x,
                    y: p3.y - p2.y
                }

                const sum = {
                    x: v1.x + v2.x,
                    y: v1.y + v2.y
                }

                const factor = dist / getPointsDistance({
                    x: 0,
                    y: 0
                }, sum)
                const vec = {
                    x: sum.x * factor,
                    y: sum.y * factor
                }

                return {
                    x: vec.x + p2.x,
                    y: vec.y + p2.y
                }
            }
        }

        return undefined;
    }

    public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
        const dist = this.size / ctx.zoom;
        if (this._points.length === 3) {
            const p1 = this._points[0].point;
            const p2 = this._points[1].point;
            const p3 = this._points[2].point;

            if (p1 !== undefined && p2 !== undefined && p3 !== undefined) {
                const base: Point = {
                    x: 1,
                    y: 0
                }
                const o: Point = {
                    x: 0,
                    y: 0
                }

                const scalarProduct = (v1: Point, v2: Point): number => {
                    return v1.x * v2.x + v1.y * v2.y
                }
                const getAngle = (v1: Point, v2: Point): number => {
                    return Math.acos(scalarProduct(v1, v2) / getPointsDistance(o, v1) / getPointsDistance(o, v2))
                }

                const v1 = {
                    x: p1.x - p2.x,
                    y: p1.y - p2.y
                }
                const v2 = {
                    x: p3.x - p2.x,
                    y: p3.y - p2.y
                }

                let a1 = getAngle(base, v1);
                let a2 = getAngle(base, v2);
                const vec = {
                    x: p.x - p2.x,
                    y: p.y - p2.y
                }
                let angle = getAngle(base, vec)

                if (p1.y > p2.y) {
                    a1 = -a1 + 2 * Math.PI;
                }
                if (p3.y > p2.y) {
                    a2 = -a2 + 2 * Math.PI;
                }
                if (p.y > p2.y) {
                    angle = -angle + 2 * Math.PI;
                }

                if (getPointsDistance(o, vec) <= dist
                    && (a2 < angle && a1 > angle || a2 > angle && a1 > angle &&  a2 > a1 || a1 < angle && a2 < angle && a2 > a1)) {
                    return 0;
                }
                
            }
        }

        return Number.MAX_VALUE;
    }
    
}