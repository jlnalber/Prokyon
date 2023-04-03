import {DrawerService} from "../../../services/drawer.service";
import {Point} from "../../interfaces/point";
import PointElement from "./pointElement";
import {BLACK, Color} from "../../interfaces/color";
import {CanvasElement} from "../abstract/canvasElement";
import {RenderingContext} from "../renderingContext";
import {Type} from "@angular/core";
import {
  DependencyPointElementsFormulaComponent
} from "../../../formula-tab/dependency-point-elements-formula/dependency-point-elements-formula.component";
import {FormulaElement} from "../abstract/formulaElement";

const dependencyPointElementsKey = '__dependencyPointElements__';

export default class DependencyPointElements extends CanvasElement {

  readonly componentType: Type<FormulaElement> = DependencyPointElementsFormulaComponent;

  private pointElements: PointElement[] = [];
  private initializedYet: boolean = false;
  private correctVersion: number = 0;
  private drawnVersion: number = 0;

  public get points(): Point[] {
    return this.pointElements.map(pEl => pEl.point);
  }

  private _stroke: Color = {
    r: 100,
    g: 100,
    b: 100
  }
  public get stroke(): Color {
    return this._stroke;
  }
  public set stroke(value: Color) {
    this._stroke = value;
    this.onChange.emit(dependencyPointElementsKey);
  }

  private _strokeWidth: number = 3;
  public get strokeWidth(): number {
    return this._strokeWidth;
  }
  public set strokeWidth(value: number) {
    this._strokeWidth = value;
    this.onChange.emit(dependencyPointElementsKey);
  }

  private _radius: number = 5;
  public get radius(): number {
    return this._radius;
  }
  public set radius(value: number) {
    this._radius = value;
    this.onChange.emit(dependencyPointElementsKey);
  }

  public get size(): number {
    return this.pointElements.length;
  }

  private _from: number;
  public get from(): number {
    return this._from;
  }
  public set from(value: number) {
    this._from = value;
    this.onChange.emit(value);
  }

  private _to: number;
  public get to(): number {
    return this._to;
  }
  public set to(value: number) {
    this._to = value;
    this.onChange.emit(value);
  }

  private _depth: number;
  public get depth(): number {
    return this._depth;
  }
  public set depth(value: number) {
    this._depth = value;
    this.onChange.emit(value);
  }

  constructor(private readonly drawerService: DrawerService,
              private readonly pointsProvider: (from: number, to: number, depth: number) => Point[],
              from: number, to: number, depth: number,
              private readonly dependencyStillActive: () => boolean,
              public description: [string, () => string | undefined],
              color: Color = BLACK, visible: boolean = true,
              private readonly firstInit?: (points: Point[]) => void) {
    super();
    this._color = color;
    this._visible = visible;
    this._from = from;
    this._to = to;
    this._depth = depth;

    this.drawerService.onCanvasElementChanged.addListener(this.reloadListener);
  }

  private async reload(): Promise<void> {
    if (this.dependencyStillActive()) {
      this.correctVersion++;
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            // Get the points.
            const points = this.pointsProvider(this.from, this.to, this.depth);

            if (!this.initializedYet && this.firstInit) {
              this.firstInit(points);
            }
            this.initializedYet = true;

            // make sure, there are enough point elements
            if (this.pointElements.length < points.length) {
              const diff = points.length - this.pointElements.length;
              for (let i = 0; i < diff; i++) {
                this.createPointElement();
              }
            } else if (this.pointElements.length > points.length) {
              const diff = this.pointElements.length - points.length;
              for (let i = 0; i < diff; i++) {
                this.pointElements.pop();
              }
            }

            // Then, set the points to the point elements
            for (let i = 0; i < points.length; i++) {
              this.pointElements[i].point = points[i];
            }

            // Trigger the redraw flow.
            this.drawnVersion++;
            this.onChange.emit(dependencyPointElementsKey);
            resolve();
          } catch (e: any) {
            this.drawnVersion++;
            reject(e);
          }
        })
      });
    } else {
      // If there is no dependency anymore, remove the listener.
      this.drawerService.removeCanvasElements(this);
    }
  }

  private reloadListener = (value: any) => {
    if (value !== dependencyPointElementsKey) {
      this.reload().catch(e => console.error(e));
    }
  }

  private createPointElement(at: Point = {x: 0, y: 0}): PointElement {
    const pointElement = new PointElement(at, this.color, true);
    pointElement.radius = this.radius;
    pointElement.stroke = this.stroke;
    pointElement.strokeWidth = this.strokeWidth;
    this.pointElements.push(pointElement);
    return pointElement;
  }

  public override draw(ctx: RenderingContext): void {
    // Draw, but only if the version is up-to-date, meaning there is no execution still running.
    if (this.visible && this.correctVersion === this.drawnVersion) {
      const selected = ctx.selection.indexOf(this) !== -1;
      for (let pointElement of this.pointElements) {
        pointElement.color = this.color;
        pointElement.radius = this.radius;
        pointElement.stroke = this.stroke;
        pointElement.strokeWidth = this.strokeWidth;
        pointElement.selected = selected;
        pointElement.draw(ctx);
      }
    }
  }

  public override getDistance(p: Point, ctx: RenderingContext): number | undefined {
    return Math.min(...this.pointElements.map(el => {
      return el.getDistance(p, ctx);
    }).filter(num => {
      return num !== undefined;
    }) as number[]);
  }

  public override onRemove() {
    // Remove the listener on the drawer service.
    this.drawerService.onCanvasElementChanged.removeListener(this.reloadListener);
  }

}
