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
import {CanvasElementSerialized} from "../../essentials/serializer";
import {
  extremumPointsInInterval,
  inflectionPointsInInterval,
  zeroPointsInInterval,
  zerosInInterval
} from "../func/funcAnalyser";
import {Graph} from "./graph";
import {
  getDependencyStillActiveListenerForGraphDependency,
  getLabelForGraphDependency
} from "../../essentials/analysingFunctionsUtils";
import {countDerivatives} from "../func/funcInspector";
import {Func} from "../func/func";
import {Subtraction} from "../func/operations/elementary-operations/subtraction";
import {ExternalFunction} from "../func/operations/externalFunction";
import {CHANGING_VARIABLE_KEY, Variable} from "../func/operations/variable";
import {
  ViewDependencyPointElementsDialogComponent
} from "../../../formula-dialogs/view-dependency-point-elements-dialog/view-dependency-point-elements-dialog.component";

const dependencyPointElementsKey = '__dependencyPointElements__';

const INTERSECTIONPOINTS_SUBTYPE = 'intersectionpoints';
const ZEROPOINTS_SUBTYPE = 'zeropoints';
const EXTREMUMPOINTS_SUBTYPE = 'extremumpoints';
const INFLECTIONPOINTS_SUBTYPE = 'inflectionpoints';

type Data = {
  from: number,
  to: number,
  depth: number,
  graph: number,
  secondGraph?: number
}

type SubTypeAndGraphs = {
  graph: number,
  subType: string,
  secondGraph?: number
}

export default class DependencyPointElements extends CanvasElement {

  readonly componentType: Type<FormulaElement> = DependencyPointElementsFormulaComponent;
  public override formulaDialogType = ViewDependencyPointElementsDialogComponent;

  private pointElements: PointElement[] = [];
  private initializedYet: boolean = false;
  private correctVersion: number = 0;
  private drawnVersion: number = 0;

  public get points(): Point[] {
    return this.pointElements.map(pEl => pEl.point!);
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
              private pointsProvider: (from: number, to: number, depth: number) => Point[],
              from: number, to: number, depth: number,
              private dependencyStillActive: () => boolean,
              public description: [string, () => string | undefined],
              protected subTypeAndGraphsProvider: () => SubTypeAndGraphs,
              color: Color = BLACK, visible: boolean = true,
              private readonly firstInit?: (points: Point[]) => void,
              addElement: boolean = true) {
    super();
    this._color = color;
    this._visible = visible;
    this._from = from;
    this._to = to;
    this._depth = depth;

    if (addElement) {
      this.onRemove.addListener(this.removeListener);
      this.drawerService.onCanvasElementChanged.addListener(this.reloadListener);
    }
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
              this.pointElements[i].forceSetPoint(points[i]);
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

  private readonly reloadListener = (value: any) => {
    if (value !== dependencyPointElementsKey && value !== this) {
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
    if (this.correctVersion === this.drawnVersion) {
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

  private readonly removeListener = () => {
    // Remove the listener on the drawer service.
    this.drawerService.onCanvasElementChanged.removeListener(this.reloadListener);
  }

  public static createIntersectionPoints(drawerService: DrawerService,
                                         graph: Graph,
                                         secondGraph: Graph,
                                         from: number,
                                         to: number,
                                         depth: number,
                                         color?: Color,
                                         firstInit?: (points: Point[]) => void,
                                         addElement: boolean = true): DependencyPointElements {
    // Collect the data.
    color = color ?? drawerService.getNewColor();
    const variableKey = CHANGING_VARIABLE_KEY + 0;

    return new DependencyPointElements(drawerService, (from: number, to: number, depth: number) => {
      if (graph.func === undefined) {
        return [];
      }

      // Helper function:
      const getFuncProviderFor: (graph: Graph) => ((key: string) => Func) = (graph: Graph) => {
        return (key: string) => {
          if (graph.func === undefined) {
            throw 'can\'t use bad function'
          }

          let f = graph.func;

          // Try to count how often the function needs to be derived.
          const derivativesKey = countDerivatives(key);
          const derivativesFunc = graph.func.name ? countDerivatives(graph.func.name) : 0;
          const diff = derivativesKey - derivativesFunc;
          if (diff < 0) {
            throw 'can\'t integrate';
          }

          for (let i = 0; i < diff; i++) {
            f = f.derive();
          }
          return f;
        }
      }

      // First, prepare a difference function.
      const diffFunc = new Func(new Subtraction(new ExternalFunction(graph.func?.name ?? '', getFuncProviderFor(graph), new Variable(variableKey)),
        new ExternalFunction(secondGraph.func?.name ?? '', getFuncProviderFor(secondGraph), new Variable(variableKey)),
      ), undefined, 'x');

      // Then, calculate the zeros.
      const variables = drawerService.getVariables();
      return zerosInInterval(diffFunc, variables, from, to, depth).map(x => {
        return {
          x,
          y: graph.func!.evaluate(x, variables)
        }
      })
    }, from, to, depth, () => {
      // Check whether both of the graphs are still available.
      let graph1Found: boolean = false;
      let graph2Found: boolean = false;
      for (let canvasElement of drawerService.canvasElements) {
        if (canvasElement === graph) graph1Found = true;
        else if (canvasElement === secondGraph) graph2Found = true;
      }
      return graph1Found && graph2Found;
    }, ['Schnittpunkte', () => {
      // Provide a label for the component in the panel.
      return graph.func !== undefined && graph.func.name && secondGraph.func?.name ? `${graph.func.name}, ${secondGraph.func.name}` : undefined
    }], () => {
      return {
        graph: graph.id,
        secondGraph: secondGraph.id,
        subType: INTERSECTIONPOINTS_SUBTYPE
      }
    }, color, true, firstInit, addElement);
  }

  public static createZeroPoints(drawerService: DrawerService,
                                 graph: Graph,
                                 from: number,
                                 to: number,
                                 depth: number,
                                 firstInit?: (points: Point[]) => void,
                                 addElement: boolean = true): DependencyPointElements {
    // create dependency point for zero points
    return DependencyPointElements.createDependencyPointElements(drawerService,
      graph,
      (from: number, to: number, depth: number) => {
        if (graph.func === undefined) {
          return [];
        }
        return zeroPointsInInterval(graph.func, drawerService.getVariables(), from, to, depth);
      },
      from,
      to,
      depth,
      ZEROPOINTS_SUBTYPE,
      'Nullpunkt',
      firstInit, addElement);
  }

  public static createExtremumPoints(drawerService: DrawerService,
                                 graph: Graph,
                                 from: number,
                                 to: number,
                                 depth: number,
                                 firstInit?: (points: Point[]) => void,
                                 addElement: boolean = true): DependencyPointElements {
    // try to derive (throws an error, when derivation doesn't work) --> opens error snackbar
    graph.func!.derive();

    // create dependency point for zero points
    return DependencyPointElements.createDependencyPointElements(drawerService,
      graph,
      (from: number, to: number, depth: number) => {
        if (graph.func === undefined) {
          return [];
        }
        return extremumPointsInInterval(graph.func, drawerService.getVariables(), from, to, depth);
      },
      from,
      to,
      depth,
      EXTREMUMPOINTS_SUBTYPE,
      'Extrempunkt',
      firstInit, addElement);
  }

  public static createInflectionPoints(drawerService: DrawerService,
                                 graph: Graph,
                                 from: number,
                                 to: number,
                                 depth: number,
                                 firstInit?: (points: Point[]) => void,
                                 addElement: boolean = true): DependencyPointElements {
    // try to derive (throws an error, when derivation doesn't work) --> opens error snackbar
    graph.func!.derive();

    // create dependency point for zero points
    return DependencyPointElements.createDependencyPointElements(drawerService,
      graph,
      (from: number, to: number, depth: number) => {
        if (graph.func === undefined) {
          return [];
        }
        return inflectionPointsInInterval(graph.func, drawerService.getVariables(), from, to, depth);
      },
      from,
      to,
      depth,
      INFLECTIONPOINTS_SUBTYPE,
      'Wendepunkt',
      firstInit, addElement);
  }

  private static createDependencyPointElements(drawerService: DrawerService,
                                               graph: Graph,
                                               pointsProvider: (from: number, to: number, depth: number) => Point[],
                                               from: number,
                                               to: number,
                                               depth: number,
                                               subType: string,
                                               name: string,
                                               firstInit?: (points: Point[]) => void,
                                               addElement: boolean = true): DependencyPointElements {
    // Create a dependency point elements canvas elements, which will adapt to change on the graph.
    return new DependencyPointElements(drawerService, pointsProvider,
      from, to, depth,
      getDependencyStillActiveListenerForGraphDependency(drawerService, graph),
      getLabelForGraphDependency(`${name}e`, graph),
      () => {
        return {
          graph: graph.id,
          subType
        }
      },
      graph.color, true, firstInit, addElement);
  }

  public static getDefaultInstance(drawerService: DrawerService): DependencyPointElements {
    return new DependencyPointElements(drawerService, () => [], 0, 0, 1, () => true, ['', () => undefined], () => {
      return {
        subType: '',
        graph: -1
      }
    }, BLACK, true, undefined, true);
  }

  public override serialize(): CanvasElementSerialized {
    const subTypeAndGraphs = this.subTypeAndGraphsProvider();
    const data: Data = {
      graph: subTypeAndGraphs.graph,
      secondGraph: subTypeAndGraphs.secondGraph,
      depth: this.depth,
      from: this.from,
      to: this.to
    }

    return {
      subType: subTypeAndGraphs.subType,
      data,
      style: {
        color: this.color,
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        size: this.radius,
        visible: this.visible
      }
    }
  }

  public override loadFrom(canvasElements: {
    [p: number]: CanvasElement | undefined
  }, canvasElementSerialized: CanvasElementSerialized) {
    const data = canvasElementSerialized.data as Data;

    // set styles
    this.color = canvasElementSerialized.style.color;
    this.stroke = canvasElementSerialized.style.stroke as Color;
    this.radius = canvasElementSerialized.style.size as number;
    this.strokeWidth = canvasElementSerialized.style.strokeWidth as number;
    this.visible = canvasElementSerialized.style.visible;

    this.depth = data.depth;
    this.from = data.from;
    this.to = data.to;

    const graph = canvasElements[data.graph];
    const secondGraph = data.secondGraph === undefined ? undefined : canvasElements[data.secondGraph];

    let d: DependencyPointElements;

    if (canvasElementSerialized.subType === INTERSECTIONPOINTS_SUBTYPE && graph instanceof Graph && secondGraph instanceof Graph) {
      d = DependencyPointElements.createIntersectionPoints(this.drawerService,
        graph, secondGraph, data.from, data.to, data.depth, undefined, undefined, false);
    } else if (canvasElementSerialized.subType === ZEROPOINTS_SUBTYPE && graph instanceof Graph) {
      d = DependencyPointElements.createZeroPoints(this.drawerService,
        graph, data.from, data.to, data.depth, undefined, false);
    } else if (canvasElementSerialized.subType === EXTREMUMPOINTS_SUBTYPE && graph instanceof Graph) {
      d = DependencyPointElements.createExtremumPoints(this.drawerService,
        graph, data.from, data.to, data.depth, undefined, false);
    } else if (canvasElementSerialized.subType === INFLECTIONPOINTS_SUBTYPE && graph instanceof Graph) {
      d = DependencyPointElements.createInflectionPoints(this.drawerService,
        graph, data.from, data.to, data.depth, undefined, false);
    } else {
      throw 'not known subtype';
    }

    this.pointsProvider = d.pointsProvider;
    this.dependencyStillActive = d.dependencyStillActive;
    this.description = d.description;
    this.subTypeAndGraphsProvider = d.subTypeAndGraphsProvider;
    this.draw = d.draw;
  }

}

