import {Component, ComponentRef, ElementRef, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {Dialog as DialogClass} from "../dialog";

export interface Dialog {
  dialogData?: any,
  dialog: DialogClass<Dialog>
}

// This component is a dialog and contains another component.

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @ViewChild('componentNeighbor', { read: ViewContainerRef }) componentNeighbor?: ViewContainerRef;
  @ViewChild('filler') filler?: ElementRef<HTMLDivElement>;
  public componentType?: Type<Dialog>;

  private component?: ComponentRef<Dialog>

  constructor() { }

  opened: boolean = false;

  private dialog?: DialogClass<Dialog>;

  public open(dialogData: any, dialog: DialogClass<Dialog>): void {
    // Open the dialog.
    this.dialog = dialog;
    setTimeout(() => {
      if (this.componentType && this.componentNeighbor) {
        // Create a new component of the given 'componentType' and insert it in the dialog.
        this.component = this.componentNeighbor.createComponent(this.componentType);
        this.component.instance.dialogData = dialogData;
        this.component.instance.dialog = dialog;
        this.opened = true;
      }
    });
  }

  public close(): any {
    // Close the dialog by destroying itself.
    if (this.component) {
      const dialogData = this.component.instance.dialogData;
      this.dialog?.destroy();
      this.opened = false;
      return dialogData;
    }
    return null;
  }

  onFillerClicked(event: MouseEvent) {
    if (this.filler && this.filler.nativeElement === event.target) {
      this.close();
    }
  }
}
