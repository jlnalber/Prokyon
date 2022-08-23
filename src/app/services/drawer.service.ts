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
import {Graph} from "../global/classes/graph";
import {getNew, sameColors} from "../global/essentials/utils";
import {colors} from "../formula-tab/formula-tab.component";
import {Config as CanvasConfig} from "../global/classes/renderingContext";
import {FuncProvider} from "../global/classes/func/operations/externalFunction";
import {Func} from "../global/classes/func/func";
import {FuncParser} from "../global/classes/func/funcParser";
import {
  analyse,
  countDerivations,
  funcNameWithoutDerivation,
  isRecursive
} from "../global/classes/func/operations/funcAnalyser";
import Cache from "../global/essentials/cache";
import VariableElement from "../global/classes/variableElement";

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

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
  public addCanvasElement(canvasElement: CanvasElement): void {
    this._canvasElements.push(canvasElement);
    canvasElement.onChange.addListener(this.redrawListener);
    this.onCanvasElementsChanged.emit(canvasElement);
  }
  public removeCanvasElement(canvasElement: CanvasElement): boolean {
    const index = this._canvasElements.indexOf(canvasElement);
    if (index >= 0) {
      this._canvasElements.splice(index, 1);
      canvasElement.onChange.removeListener(this.redrawListener);
      this.onCanvasElementsChanged.emit(canvasElement);
      return true;
    }
    return false;
  }
  public get canvasElements(): CanvasElement[] {
    return this._canvasElements.slice();
  }

  public get graphs(): Graph[] {
    let graphs = [];
    for (let cEl of this.canvasElements) {
      if (cEl instanceof Graph) {
        graphs.push(cEl);
      }
    }
    return graphs;
  }

  public readonly funcProvider: FuncProvider = (key: string) => {
    // first, read from cache
    let func = this.funcCache.getItem(key);
    if (func) {
      return func;
    }

    // then look up in the graphs
    for (let graph of this.graphs) {
      if (funcNameWithoutDerivation(key) === funcNameWithoutDerivation(graph.func.name)) {
        let func = graph.func

        // derive to the requested level
        let deriveNow = countDerivations(func.name!);
        let requestedDerive = countDerivations(key);
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

  private readonly funcCache: Cache<string, Func> = new Cache<string, Func>();

  public parseAndValidateFunc(str: string, requestConstants: boolean = true): Func | string {
    const parserError = 'Ungültige Eingabe.';
    const recursiveError = 'Eine Funktion darf nicht auf sich selbst verweisen.'
    try {
      let func = new FuncParser(str, this.funcProvider).parse();

      try {
        if (isRecursive(func)) {
          return recursiveError;
        }

        let analyserRes = analyse(func);

        if (requestConstants) {
          for (let variable of analyserRes.variableNames) {
            if (variable !== func.variable && (func.variable !== undefined || variable !== 'x') && !this.hasVariable(variable)) {
              this.addCanvasElement(new VariableElement(variable, 0));
            }
          }
        }

        return func;
      }
      catch (e) {
        return parserError;
      }
    }
    catch {
      return parserError;
    }
  }

  public getNewColorForGraph(): Color {
    return getNew(colors, this.graphs.map(g => g.color), (c1, c2) => { return sameColors(c1, c2) })
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

  public zoomToBy(p: Point, factor: number): void {
    let vec: Vector = {
      x: p.x / this.zoom * (1 - 1 / factor),
      y: -p.y / this.zoom * (1 - 1 / factor)
    }
    this._transformations.translateX -= vec.x;
    this._transformations.translateY -= vec.y;
    this.zoom *= factor;
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

  // Events
  public readonly onBackgroundColorChanged: Event<Color> = new Event<Color>();
  public readonly onCanvasElementsChanged: Event<CanvasElement> = new Event<CanvasElement>();
  public readonly onMetaDrawersChanged: Event<CanvasDrawer> = new Event<CanvasDrawer>();
  public readonly onTransformationsChanged: Event<number> = new Event<number>();
  public readonly onCanvasConfigChanged: Event<CanvasConfig> = new Event<CanvasConfig>();
  public readonly onBeforeRedraw: Event<undefined> = new Event<undefined>();
  public readonly onAfterRedraw: Event<undefined> = new Event<undefined>();

  private redrawListener = () => {
    this.redraw();
  }

  private emptyCacheListener = () => {
    this.funcCache.empty();
  }

  public canvas?: CanvasComponent;

  constructor() {
    this.addMetaDrawer(new Grid());

    this.onBackgroundColorChanged.addListener(this.redrawListener);
    this.onCanvasElementsChanged.addListener(this.redrawListener);
    this.onTransformationsChanged.addListener(this.redrawListener);
    this.onMetaDrawersChanged.addListener(this.redrawListener);
    this.onCanvasConfigChanged.addListener(this.redrawListener);

    this.onBeforeRedraw.addListener(this.emptyCacheListener);
    this.onAfterRedraw.addListener(this.emptyCacheListener);
  }

  public get renderingContext(): RenderingContext {
    return new RenderingContext(this.canvas?.ctx as CanvasRenderingContext2D, this._transformations, this.getVariables(), this.canvasConfig);
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

}
