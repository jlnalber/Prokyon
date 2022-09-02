import {Dialog as DialogComponentType, DialogComponent} from "./dialog/dialog.component";
import {ComponentRef, Type} from "@angular/core";

// This class is a wrapper for opening, destroying and closing dialogs.

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
