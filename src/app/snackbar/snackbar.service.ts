import {Injectable, ViewContainerRef} from '@angular/core';
import {SnackbarComponent} from "./snackbar/snackbar.component";

export interface SnackbarConfig {
  color?: string,
  background?: string,
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  public rootViewContainerRef?: ViewContainerRef;

  constructor() { }

  public openSnackbar(message: string, snackbarConfig?: SnackbarConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.rootViewContainerRef) {
        reject();
        return;
      }

      const duration = snackbarConfig?.duration ?? 4000;
      const snackbar = this.rootViewContainerRef?.createComponent(SnackbarComponent);

      if (!snackbar) {
        reject();
        return;
      }

      snackbar.instance.message = message;
      snackbar.instance.snackbarConfig = snackbarConfig;

      setTimeout(() => {
        snackbar.destroy();
        resolve();
      }, duration);
    })
  }
}
