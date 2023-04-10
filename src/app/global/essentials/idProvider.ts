import {CanvasElement} from "../classes/abstract/canvasElement";

const ids: number[] = [];

export default function getNewID(): number {
  for (let i = 0; true; i++) {
    if (ids.indexOf(i) === -1) {
      ids.push(i);
      return i;
    }
  }
  return Number.NaN;
}

export function getElementToID(canvasElements: CanvasElement[], id: number): CanvasElement | undefined {
  for (let c of canvasElements) {
    if (c.id === id) {
      return c;
    }
  }
  return undefined;
}
