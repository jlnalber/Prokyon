import {CanvasElement, CanvasElementConfiguration} from "../classes/abstract/canvasElement";
import {Graph} from "../classes/canvas-elements/graph";
import LineElement from "../classes/canvas-elements/lineElement";
import {Color} from "../interfaces/color";
import CircleElement from "../classes/canvas-elements/circleElement";
import DefiniteIntegral from "../classes/canvas-elements/definiteIntegral";

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
  type: string
} & CanvasElementSerialized;

export function serialize(canvasElements: CanvasElement[]): CanvasElementSerializedComplete[] {
  const res: CanvasElementSerializedComplete[] = [];

  for (let canvasElement of canvasElements) {
    const s = canvasElement.serialize();
    const c: CanvasElementSerializedComplete = {
      ...s,
      id: canvasElement.id,
      configuration: canvasElement.configuration,
      type: getType(canvasElement)
    }
    res.push(c);
  }

  return res;
}

const CIRCLE_TYPE = 'circle';
const DEFINITE_INTEGRAL_TYPE = 'definite_integral';
const GRAPH_TYPE = 'graph';
const LINE_TYPE = 'line';
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
  }
  return UNKNOWN_TYPE;
}
