import {Injectable, Type, ViewContainerRef} from '@angular/core';
import {Dialog as DialogComponentType, DialogComponent} from "./dialog/dialog.component";
import {Dialog} from "./dialog";

// This service is responsible for creating dialogs.

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public rootViewContainerRef?: ViewContainerRef;

  constructor() { }

  public createDialog<T extends DialogComponentType>(dialogType: Type<T>): Dialog<T> | null {
    // if there are no components yet, return null
    if (!this.rootViewContainerRef) {
      return null;
    }

    // else, create a new Dialog
    const dialogComponent = this.rootViewContainerRef.createComponent(DialogComponent);
    return new Dialog<T>(dialogComponent, dialogType);
  }
}

