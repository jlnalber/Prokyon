import { Injectable } from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {CanvasElement} from "../global/classes/abstract/canvasElement";
import {Color, getColorAsRgbaFunction} from "../global/interfaces/color";
import {Event} from "../global/essentials/event";
import {RenderingContext} from "../global/classes/renderingContext";
import {Transformations} from "../global/interfaces/transformations";
import {Point, Vector} from "../global/interfaces/point";
import { CanvasDrawer } from '../global/classes/abstract/canvasDrawer';
import {Grid} from "../global/classes/grid";
import {Graph} from "../global/classes/canvas-elements/graph";
import {getNew, sameColors} from "../global/essentials/utils";
import {Config as CanvasConfig} from "../global/classes/renderingContext";
import {FuncProvider} from "../global/classes/func/operations/externalFunction";
import {Func} from "../global/classes/func/func";
import {FuncParser} from "../global/classes/func/funcParser";
import {
  inspect,
  containsVariable,
  countderivatives,
  funcNameWithoutderivative,
  isRecursive
} from "../global/classes/func/funcInspector";
import Cache from "../global/essentials/cache";
import VariableElement from "../global/classes/canvas-elements/variableElement";
import Selection from "../global/essentials/selection";
import PointElement from "../global/classes/canvas-elements/pointElement";
import {colors} from "../global/styles/colors";

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  // #region the properties of the canvas --> bgColor, elements in canvas, transformations and config
  private _backgroundColor: Color = {
    r: 255,
    g: 255,
    b: 255
  };
  public get backgroundColor(): Color {
    return this._backgroundColor;
  }
  public set backgroundColor(value: Color) {
    this._backgroundColor = value;
    this.onBackgroundColorChanged.emit(value);
  }

  private _canvasElements: CanvasElement[] = [];
  public addCanvasElement(...canvasElements: CanvasElement[]): void {
    for (let canvasElement of canvasElements) {
      this._canvasElements.push(canvasElement);
      canvasElement.onChange.addListener(this.canvasElementOnChangeListener);
    }
    this.onCanvasElementChanged.emit(canvasElements);
  }
  public removeCanvasElement(canvasElement: CanvasElement): boolean {
    const index = this._canvasElements.indexOf(canvasElement);
    if (index >= 0) {
      this._canvasElements.splice(index, 1);
      canvasElement.onChange.removeListener(this.canvasElementOnChangeListener);
      this.onCanvasElementChanged.emit(canvasElement);
      return true;
    }
    return false;
  }
  public emptyCanvasElements(): void {
    for (let canvasElement of this._canvasElements) {
      canvasElement.onChange.removeListener(this.canvasElementOnChangeListener);
    }
    this._canvasElements = [];
    this.onCanvasElementChanged.emit();
  }
  public get canvasElements(): CanvasElement[] {
    return this._canvasElements.slice();
  }

  private _metaDrawers: CanvasDrawer[] = [];
  public addMetaDrawer(canvasElement: CanvasDrawer): void {
    this._metaDrawers.push(canvasElement);
    this.onMetaDrawersChanged.emit(canvasElement);
  }
  public removeMetaDrawer(canvasElement: CanvasDrawer): boolean {
    const index = this._metaDrawers.indexOf(canvasElement);
    if (index >= 0) {
      this._metaDrawers.splice(index, 1);
      this.onMetaDrawersChanged.emit(canvasElement);
      return true;
    }
    return false;
  }
  public emptyMetaDrawers(): void {
    this._metaDrawers = [];
    this.onMetaDrawersChanged.emit();
  }
  public get metaDrawers(): CanvasDrawer[] {
    return this._metaDrawers.slice();
  }

  private _transformations: Transformations = {
    translateX: 7,
    translateY: -5,
    zoom: 100
  };
  public set translateX(value: number) {
    this._transformations.translateX = value;
    this.onTransformationsChanged.emit(value);
  }
  public get translateX(): number {
    return this._transformations.translateX;
  }
  public set translateY(value: number) {
    this._transformations.translateY = value;
    this.onTransformationsChanged.emit(value);
  }
  public get translateY(): number {
    return this._transformations.translateY;
  }
  public set zoom(value: number) {
    this._transformations.zoom = value;
    this.onTransformationsChanged.emit(value);
  }
  public get zoom(): number {
    return this._transformations.zoom;
  }

  private _showGrid: boolean = true;
  public get showGrid(): boolean {
    return this._showGrid;
  }
  public set showGrid(value: boolean) {
    this._showGrid = value;
    this.onCanvasConfigChanged.emit(this.canvasConfig);
  }
  private _showGridNumbers: boolean = true;
  public get showGridNumbers(): boolean {
    return this._showGridNumbers;
  }
  public set showGridNumbers(value: boolean) {
    this._showGridNumbers = value;
    this.onCanvasConfigChanged.emit(this.canvasConfig);
  }
  private get canvasConfig(): CanvasConfig {
    return {
      showNumbers: this.showGridNumbers,
      showGrid: this.showGrid
    }
  }
  // #endregion

  // other properties
  public readonly selection: Selection<CanvasElement> = new Selection<CanvasElement>();
  public canvas?: CanvasComponent;

  // Events
  public readonly onBackgroundColorChanged: Event<Color> = new Event<Color>();
  public readonly onCanvasElementChanged: Event<any> = new Event<any>();
  public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
  public readonly onTransformationsChanged: Event<number> = new Event<number>();
  public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
  public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
  public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();

  // Event listeners
  private redrawListener = () => {
    this.redraw();
  }
  private canvasElementOnChangeListener = (val: any) => {
    this.onCanvasElementChanged.emit(val);
  }
  private emptyCacheListener = () => {
    this.funcCache.empty();
  }

  constructor() {
    this.addMetaDrawer(new Grid());

    this.onBackgroundColorChanged.addListener(this.redrawListener);
    this.onCanvasElementChanged.addListener(this.redrawListener);
    this.onTransformationsChanged.addListener(this.redrawListener);
    this.onMetaDrawersChanged.addListener(this.redrawListener);
    this.onCanvasConfigChanged.addListener(this.redrawListener);
    this.selection.onSelectionChanged.addListener(this.redrawListener);

    this.onCanvasElementChanged.addListener(this.emptyCacheListener);
    this.onCanvasElementChanged.addListener(this.emptyCacheListener);

    this.onBeforeRedraw.addListener(() => {
      console.log('on before redraw')
    })
  }

  // #region fields for rendering
  public get renderingContext(): RenderingContext {
    return new RenderingContext(this.canvas?.ctx as CanvasRenderingContext2D, this._transformations, this.getVariables(), this.selection.toArray(), this.canvasConfig);
  }

  public redraw(): void {
    if (this.canvas && this.canvas.canvasEl && this.canvas.wrapperEl && this.canvas.ctx) {
      this.onBeforeRedraw.emit();

      // resize canvas
      let boundingRect = this.canvas.wrapperEl.getBoundingClientRect();
      this.canvas.ctx.canvas.width = boundingRect.width;
      this.canvas.ctx.canvas.height = boundingRect.height;

      // first: draw the background
      this.canvas.ctx.fillStyle = getColorAsRgbaFunction(this.backgroundColor);
      this.canvas.ctx.fillRect(0, 0, this.canvas.canvasEl.width, this.canvas.canvasEl.height);

      // then: draw the elements (first metaDrawers, then canvasElements)
      let renderingContext = this.renderingContext;
      for (let metaDrawer of this._metaDrawers) {
        metaDrawer.draw(renderingContext);
      }
      for (let canvasElement of this._canvasElements) {
        canvasElement.draw(renderingContext);
      }

      this.onAfterRedraw.emit();
    }
  }

  public zoomToBy(p: Point, factor: number): void {
    let vec: Vector = {
      x: p.x / this.zoom * (1 - 1 / factor),
      y: -p.y / this.zoom * (1 - 1 / factor)
    }
    this._transformations.translateX -= vec.x;
    this._transformations.translateY -= vec.y;
    this.zoom *= factor;
  }
  // #endregion

  // #region fields for dealing with graphs/functions/points
  public get graphs(): Graph[] {
    return this.canvasElements.filter(el => el instanceof Graph) as Graph[];
  }

  public get points(): PointElement[] {
    return this.canvasElements.filter(el => el instanceof PointElement) as PointElement[];
  }

  private readonly funcCache: Cache<string, Func> = new Cache<string, Func>();

  public readonly funcProvider: FuncProvider = (key: string) => {
    // first, read from cache
    let func = this.funcCache.getItem(key);
    if (func) {
      return func;
    }

    // then look up in the graphs
    for (let graph of this.graphs) {
      if (funcNameWithoutderivative(key) === funcNameWithoutderivative(graph.func.name)) {
        let func = graph.func

        // derive to the requested level
        let deriveNow = countderivatives(func.name!);
        let requestedDerive = countderivatives(key);
        if (deriveNow > requestedDerive) {
          continue;
        }
        for (let i = 0; i < requestedDerive - deriveNow; i++) {
          func = func.derive();
        }

        // store in cache
        this.funcCache.setItem(key, func);
        return func;
      }
    }
    return undefined;
  }

  public parseAndValidateFunc(str: string, requestVariables: boolean = true): Func | string {
    // this function tries to parse a string to a func
    // if 'requestVariables' is true, the function tries to create a new variable
    const parserError = 'Ungültige Eingabe.';
    const unknownFunction = "Diese Funktion referenziert eine unbekannte Funktion."
    const recursiveError = 'Eine Funktion darf nicht auf sich selbst verweisen.'
    try {
      // try to parse the function
      let func = new FuncParser(str, this.funcProvider).parse();

      try {
        // function can't be recursive, otherwise it would end up in an endless loop
        if (isRecursive(func)) {
          return recursiveError;
        }

        // analyse the function, it is not just needed for checking for variables, but also for unknown functions
        let analyserRes = inspect(func);

        // find the variables
        if (requestVariables) {
          for (let variable of analyserRes.variableNames) {
            // if the variable is unknown, add it
            if (variable !== func.variable && (func.variable !== undefined || variable !== 'x') && !this.hasVariable(variable)) {
              const variableElement = new VariableElement(variable, 0);

              // listen whether the variable is sill in use, if not remove
              let checkForReferenceListener = () => {
                let hasReference = false;
                for (let graph of this.graphs) {
                  hasReference = hasReference || containsVariable(graph.func, variableElement.key);
                }
                if (!hasReference) {
                  this.onCanvasElementChanged.removeListener(checkForReferenceListener);
                  this.removeCanvasElement(variableElement);
                }
              }

              // add the variableElement
              this.addCanvasElement(variableElement);
              this.onCanvasElementChanged.addListener(checkForReferenceListener);
            }
          }
        }

        // return function --> everything worked out fine
        return func;
      }
      catch {
        // return an unknown function error
        return unknownFunction;
      }
    }
    catch {
      // return a parser error
      return parserError;
    }
  }

  public getNewColor(): Color {
    return getNew(colors,
      (this.graphs as (Graph | PointElement)[]).concat(...this.points).map(g => g.color),
      (c1, c2) => { return sameColors(c1, c2) })
  }

  public getVariables(): any {
    // collect the data about the variables
    let res: any = {};
    for (let canvasElement of this.canvasElements) {
      if (canvasElement instanceof VariableElement) {
        res[canvasElement.key] = canvasElement.value;
      }
    }
    return res;
  }

  public hasVariable(key: string): boolean {
    // loop through the canvasElements and search for variableElements
    for (let canvasElement of this.canvasElements) {
      if (canvasElement instanceof VariableElement && canvasElement.key === key) {
        return true;
      }
    }
    return false;
  }
  // #endregion

  // #region further fields
  public setSelection(p: Point, empty: boolean = true) {
    let ctx = this.renderingContext;
    let newP = ctx.transformPointFromCanvasToField(p);
    let minDist: number | undefined = undefined;
    let minCanvasElement: CanvasElement | undefined;

    // find out the element with the minimal distance
    for (let canvasElement of this.canvasElements) {
      const dist = canvasElement.getDistance(newP, ctx);
      if (dist) {
        let closer = minDist === undefined;
        closer = closer || dist <= minDist!;
        if (closer) {
          minDist = dist;
          minCanvasElement = canvasElement;
        }
      }
    }

    // if the distance is too high, don't do anything
    const maxDistance = 10;
    if (minDist !== undefined && maxDistance < minDist * this.zoom) {
      minCanvasElement = undefined;
      minDist = undefined;
    }

    // set the selection, or alternate the element, e.g. when ctrl is pressed
    if (empty) {
      this.selection.set(minCanvasElement);
    }
    else {
      this.selection.alternate(minCanvasElement);
    }
  }
  // #endregion

}
