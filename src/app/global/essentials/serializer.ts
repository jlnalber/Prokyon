import {CanvasElement, CanvasElementConfiguration} from "../classes/abstract/canvasElement";
import {Graph} from "../classes/canvas-elements/graph";
import LineElement from "../classes/canvas-elements/lineElement";
import {Color} from "../interfaces/color";
import CircleElement from "../classes/canvas-elements/circleElement";
import DefiniteIntegral from "../classes/canvas-elements/definiteIntegral";
import DependencyPointElements from "../classes/canvas-elements/dependencyPointElements";
import LineSegmentElement from "../classes/canvas-elements/lineSegmentElement";
import DynamicPointElement from "../classes/canvas-elements/dynamicPointElement";
import PointElement from "../classes/canvas-elements/pointElement";
import {DrawerService} from "../../services/drawer.service";
import {Transformations} from "../interfaces/transformations";
import VariableElement from "../classes/canvas-elements/variableElement";
import {Point} from "../interfaces/point";
import AngleElement from "../classes/canvas-elements/angleElement";

export interface Style {
  color: Color,
  visible: boolean,
  size?: number,
  stroke?: Color,
  strokeWidth?: number
}

export interface CanvasElementSerialized {
  subType?: string,
  data: any,
  style: Style
}

type CanvasElementSerializedComplete = {
  id: number,
  configuration: CanvasElementConfiguration
  type: string,
  translateLabel: Point
} & CanvasElementSerialized;

export type Serialized = {
  canvasElements: CanvasElementSerializedComplete[],
  transformations: Transformations,
  backgroundColor: Color,
  showGrid: boolean,
  showGridNumbers: boolean
}

export function serialize(drawerService: DrawerService): Serialized {
  const canvasElements: CanvasElementSerializedComplete[] = [];

  for (let canvasElement of drawerService.canvasElements) {
    const s = canvasElement.serialize();
    const c: CanvasElementSerializedComplete = {
      ...s,
      id: canvasElement.id,
      configuration: canvasElement.configuration,
      type: getType(canvasElement),
      translateLabel: canvasElement.labelTranslate
    }
    canvasElements.push(c);
  }

  return {
    canvasElements,
    backgroundColor: drawerService.backgroundColor,
    transformations: drawerService.transformations,
    showGrid: drawerService.showGrid,
    showGridNumbers: drawerService.showGridNumbers
  };
}

const CIRCLE_TYPE = 'circle';
const DEFINITE_INTEGRAL_TYPE = 'definite_integral';
const DEPENDENCY_POINTS_TYPE = 'dependency_points';
const LINESEGMENT_TYPE = 'linesegment';
const GRAPH_TYPE = 'graph';
const DYNAMIC_POINT_TYPE = 'dynamic_point';
const POINT_TYPE = 'point';
const LINE_TYPE = 'line';
const VARIABLE_TYPE = 'variable';
const ANGLE_TYPE = 'angle'
const UNKNOWN_TYPE = 'undefined';

function getType(cE: CanvasElement): string {
  if (cE instanceof Graph) {
    return GRAPH_TYPE;
  } else if (cE instanceof LineElement) {
    return LINE_TYPE;
  } else if (cE instanceof CircleElement) {
    return CIRCLE_TYPE;
  } else if (cE instanceof DefiniteIntegral) {
    return DEFINITE_INTEGRAL_TYPE;
  } else if (cE instanceof DependencyPointElements) {
    return DEPENDENCY_POINTS_TYPE;
  } else if (cE instanceof LineSegmentElement) {
    return LINESEGMENT_TYPE;
  } else if (cE instanceof DynamicPointElement) {
    return DYNAMIC_POINT_TYPE;
  } else if (cE instanceof PointElement) {
    return POINT_TYPE;
  } else if (cE instanceof VariableElement) {
    return VARIABLE_TYPE;
  } else if (cE instanceof AngleElement) {
    return ANGLE_TYPE;
  }
  return UNKNOWN_TYPE;
}

export function loadFrom(drawerService: DrawerService, serialized: Serialized): void {
  drawerService.showGridNumbers = serialized.showGridNumbers;
  drawerService.showGrid = serialized.showGrid;
  drawerService.transformations = serialized.transformations;
  drawerService.backgroundColor = serialized.backgroundColor;

  drawerService.emptyCanvasElements();

  const canvasElements: { [id: number]: CanvasElement | undefined } = {};
  for (let c of serialized.canvasElements) {
    let canvasElement: CanvasElement | undefined = undefined;

    if (c.type === CIRCLE_TYPE) {
      canvasElement = CircleElement.getDefaultInstance();
    } else if (c.type === DEFINITE_INTEGRAL_TYPE) {
      canvasElement = DefiniteIntegral.getDefaultInstance();
    } else if (c.type === DEPENDENCY_POINTS_TYPE) {
      canvasElement = DependencyPointElements.getDefaultInstance(drawerService);
    } else if (c.type === LINESEGMENT_TYPE) {
      canvasElement = LineSegmentElement.getDefaultInstance();
    } else if (c.type === GRAPH_TYPE) {
      canvasElement = Graph.getDefaultInstance();
    } else if (c.type === DYNAMIC_POINT_TYPE) {
      canvasElement = DynamicPointElement.getDefaultInstance();
    } else if (c.type === POINT_TYPE) {
      canvasElement = PointElement.getDefaultInstance();
    } else if (c.type === LINE_TYPE) {
      canvasElement = LineElement.getDefaultInstance();
    } else if (c.type === VARIABLE_TYPE) {
      canvasElement = VariableElement.getDefaultInstance();
    } else if (c.type === ANGLE_TYPE) {
      canvasElement = AngleElement.getDefaultInstance();
    }

    if (canvasElement !== undefined) {
      canvasElement.configuration = c.configuration;
      canvasElement.labelTranslate = c.translateLabel;
      canvasElements[c.id] = canvasElement;
    }
  }

  for (let c of serialized.canvasElements) {
    const canvasElement = canvasElements[c.id];
    if (canvasElement !== undefined) {
      canvasElement.loadFrom(canvasElements, c, drawerService);
    }
  }
  drawerService.addCanvasElements(...(Object.values(canvasElements).filter(c => c !== undefined) as CanvasElement[]));
}
