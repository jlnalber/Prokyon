import {Component, ComponentRef, ElementRef, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {Dialog as DialogClass} from '../dialog.service';

export type Dialog = {
  dialogData?: any,
  dialog: DialogClass<Dialog>
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @ViewChild('componentNeighbor', { read: ViewContainerRef }) componentNeighbor?: ViewContainerRef;
  @ViewChild('filler') filler?: ElementRef<HTMLDivElement>;
  public componentType?: Type<Dialog>;

  private component?: ComponentRef<Dialog>

  constructor() { }

  ngOnInit(): void {
  }

  opened: boolean = false;

  private dialog: DialogClass<Dialog> | undefined;

  public open(dialogData: any, dialog: DialogClass<Dialog>): void {
    this.dialog = dialog;
    setTimeout(() => {
      if (this.componentType && this.componentNeighbor) {
        this.component = this.componentNeighbor.createComponent(this.componentType);
        this.component.instance.dialogData = dialogData;
        this.component.instance.dialog = dialog;
        this.opened = true;
      }
    });
  }

  public close(): any {
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
