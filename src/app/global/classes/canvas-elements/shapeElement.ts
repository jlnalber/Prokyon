import { Type } from "@angular/core";
import { DrawerService } from "src/app/services/drawer.service";
import { CanvasElementSerialized } from "../../essentials/serializer";
import { CanvasElement } from "../abstract/canvasElement";
import FormulaDialogElement from "../abstract/formulaDialogElement";
import { FormulaElement } from "../abstract/formulaElement";
import { RenderingContext } from "../renderingContext";
import { Point } from "../../interfaces/point";
import DynamicElement from "./dynamicElement";
import { Color, colorAsTransparent, TRANSPARENT } from "../../interfaces/color";
import { GeometricFormulaComponent } from "src/app/formula-tab/geometric-formula/geometric-formula.component";
import { LINE_WIDTH_SELECTED_RATIO } from "./graph";
import PointElement from "./pointElement";
import { ViewShapeElementComponent } from "src/app/formula-dialogs/view-shape-element/view-shape-element.component";

type Data = {
    points: number[]
}

export default class ShapeElement extends DynamicElement {
    public override componentType: Type<GeometricFormulaComponent> = GeometricFormulaComponent;
    public override formulaDialogType: Type<FormulaDialogElement> | undefined = ViewShapeElementComponent;

    public get lineWidth(): number {
        return this._lineWidth;
    }

    public set lineWidth(value: number) {
        this._lineWidth = value;
        this.onChange.emit(value);
    }

    private _pointsProvider: PointsProvider;
  
    private _tempPoints: (Point | undefined)[] | undefined;
  
    public getPointAt(index: number): Point | undefined {
      if (this._tempPoints === undefined) {
        this._tempPoints = this._pointsProvider();
      }
      return this._tempPoints[index];
    }

    public get points(): (Point | undefined)[] {
      if (this._tempPoints === undefined) {
        this._tempPoints = this._pointsProvider();
      }
      return this._tempPoints.slice();
    }
  
    public get pointsProvider(): PointsProvider {
      return this._pointsProvider;
    }
  
    public set pointsProvider(value: PointsProvider) {
      this._pointsProvider = value;
      this.onChange.emit(value);
    }
    

    constructor(psProvider: PointsProvider,
                        dependencies: CanvasElement[],
                        protected dataProvider: () => Data,
                        color: Color = { r: 0, g: 0, b: 0 },
                        formula?: string,
                        visible: boolean = true,
                        private _lineWidth: number = 3,
                        showLabel: boolean = true) {
        super(dependencies);
        this.configuration.formula = formula;
        this.configuration.showLabel = showLabel;
        this._color = color;
        this._visible = visible;
        this._pointsProvider = psProvider;
    }


    public override serialize(): CanvasElementSerialized {
        return {
            data: this.dataProvider(),
            style: {
                color: this._color,
                visible: this._visible,
                strokeWidth: this._lineWidth
            }
        }
    }

    public override loadFrom(canvasElements: { [id: number]: CanvasElement | undefined; }, canvasElementSerialized: CanvasElementSerialized, drawerService: DrawerService): void {
        const data: Data = canvasElementSerialized.data as Data;

        // first, load the points
        const ps: PointElement[] = [];
        for (let i of data.points) {
            const el = canvasElements[i];
            if (el !== undefined && el instanceof PointElement) {
                this.addDependency(el);
                ps.push(el);
            }
        }
        this.pointsProvider = () => ps.map(p => p.point);
        this.dataProvider = () => {
            return {
                points: ps.map(p => p.id)
            }
        };

        // load the style
        this.color = canvasElementSerialized.style.color;
        this.visible = canvasElementSerialized.style.visible;
        this.lineWidth = canvasElementSerialized.style.strokeWidth ?? this.lineWidth
    }

    public override draw(ctx: RenderingContext): void {
        const ps = this.points;
        if (ps.length === 0) {
            return;
        }
        for (let p of ps) {
            if (p === undefined) {
                // all points need to be defined
                return;
            }
        }
        ps.push(ps[0])

        // Check whether this element is selected.
        const selected = ctx.selection.indexOf(this) !== -1;
        const fillColor = colorAsTransparent(this.color, selected ? 0.5 : 0.3)
        
        ctx.drawPath(ps as Point[], 
            this.lineWidth,
            this.color,
            fillColor,
            this.configuration.dashed)

        if (ctx.selection.indexOf(this) !== -1) {
            ctx.drawPath(ps as Point[],
                this.lineWidth * LINE_WIDTH_SELECTED_RATIO,
                colorAsTransparent(this.color, 0.3),
                TRANSPARENT,
                this.configuration.dashed)
        }
    }

    protected override resetTempListener = () => {
      this._tempPoints = undefined;
    }


    public static getDefaultInstance(): ShapeElement {
        return new ShapeElement(() => [], [], () => {
            return {
                points: []
            }
        });
    }

    public pointInPolygon(p: Point): boolean {
        const ps = this.points;
        if (ps.length === 0) {
            return false;
        }
        for (let p of ps) {
            if (p === undefined) {
                // all points need to be defined
                return false;
            }
        }
        let points = ps as Point[];

        // Copilot:
        let innen = false;
        const n = ps.length;
    
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const xi = points[i].x, yi = points[i].y;
            const xj = points[j].x, yj = points[j].y;
    
            const schnitt = ((yi > p.y) !== (yj > p.y)) &&
                            (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
            if (schnitt) {
                innen = !innen;
            }
        }
    
        return innen;
    }
    
    public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
        
        function abstandZuLinie(p: Point, a: Point, b: Point): number {
            const A = p.x - a.x;
            const B = p.y - a.y;
            const C = b.x - a.x;
            const D = b.y - a.y;
        
            const dot = A * C + B * D;
            const len_sq = C * C + D * D;
            const param = len_sq !== 0 ? dot / len_sq : -1;
        
            let xx, yy;
        
            if (param < 0) {
                xx = a.x;
                yy = a.y;
            } else if (param > 1) {
                xx = b.x;
                yy = b.y;
            } else {
                xx = a.x + param * C;
                yy = a.y + param * D;
            }
        
            const dx = p.x - xx;
            const dy = p.y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        function distanzZumVieleck(punkt: Point, vieleck: Point[]): number {
            let minDistanz = Infinity;
            const n = vieleck.length;
        
            for (let i = 0; i < n; i++) {
                const a = vieleck[i];
                const b = vieleck[(i + 1) % n];
                const distanz = abstandZuLinie(punkt, a, b);
                if (distanz < minDistanz) {
                    minDistanz = distanz;
                }
            }
        
            return minDistanz;
        }
        
        const ps = this.points;
        if (ps.length === 0) {
            return undefined;
        }
        for (let p of ps) {
            if (p === undefined) {
                // all points need to be defined
                return undefined;
            }
        }
        let points = ps as Point[];
        
        const istInnen = this.pointInPolygon(p);
        if (istInnen) {
            return 0;
        } else {
            return distanzZumVieleck(p, points);
        }
    }

    public override getPositionForLabel(rtx: RenderingContext): Point | undefined {
        const ps = this.points;
        if (ps.length === 0) {
            return undefined;
        }
        for (let p of ps) {
            if (p === undefined) {
                // all points need to be defined
                return undefined;
            }
        }
        let points = ps as Point[];

        const sum = (ns: number[]): number => {
            let s = 0;
            for (let n of ns) {
                s += n;
            }
            return s;
        }
        
        return {
            x: sum(points.map(p => p.x)) / points.length,
            y: sum(points.map(p => p.y)) / points.length
        }
    }
    
}

export type PointsProvider = () => (Point | undefined)[]