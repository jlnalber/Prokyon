import {SnackbarService} from "../../snackbar/snackbar.service";
import {DrawerService} from "../../services/drawer.service";
import {Graph} from "../classes/canvas-elements/graph";

export function getMessageForSpecialPoints(name: string, count: number): string {
  if (count !== 1) {
    name += 'e';
  }
  if (count === 0) {
    return `Keine ${name} gefunden.`;
  }
  else if (count === 1) {
    return `Ein ${name} gefunden.`;
  }
  else {
    return `${count} ${name} gefunden.`;
  }
}

export function openSnackbarWithMessageForSpecialPoints(snackbarService: SnackbarService, name: string, count: number): void {
  snackbarService.openSnackbar(getMessageForSpecialPoints(name, count));
}

export function openErrorSnackbar(snackbarService: SnackbarService, errorMessage: string = 'Ein unerwarteter Fehler ist aufgetreten!'): void {
  snackbarService.openSnackbar(errorMessage, {
    color: 'white',
    background: '#c44'
  })
}

export function getDependencyStillActiveListenerForGraphDependency(drawerService: DrawerService, graph: Graph): () => boolean {
  return () => {
    for (let canvasElement of drawerService.canvasElements) {
      if (canvasElement === graph) return true;
    }
    return false;
  }
}

export function getLabelForGraphDependency(name: string, graph: Graph): [string, () => string | undefined] {
  return [name, () => graph.func?.name]
}
