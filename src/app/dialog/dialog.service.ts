import {ComponentRef, Injectable, Type, ViewContainerRef} from '@angular/core';
import {DialogComponent, Dialog as DialogComponentType} from "./dialog/dialog.component";

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

export class Dialog<T extends DialogComponentType> {
  private readonly dialogComponent: DialogComponent;
  constructor(private readonly dialogComponentRef: ComponentRef<DialogComponent>, private readonly componentType: Type<T>) {
    this.dialogComponent = this.dialogComponentRef.instance;
    this.dialogComponent.componentType = componentType;
  }
  public open(dialogData?: any): void {
    this.dialogComponent.open(dialogData, this);
  }
  public close(): any {
    return this.dialogComponent.close();
  }
  public destroy(): void {
    this.dialogComponentRef.destroy();
  }
}
