import {Component, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';

export type Dialog = {
  dialogData: any
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @ViewChild('componentNeighbor', { read: ViewContainerRef }) componentNeighbor?: ViewContainerRef;
  public componentType?: Type<Dialog>;

  private component?: ComponentRef<Dialog>

  constructor() { }

  ngOnInit(): void {
  }

  opened: boolean = false;

  public open(dialogData: any): void {
    setTimeout(() => {
      if (this.componentType && this.componentNeighbor) {
        this.component = this.componentNeighbor.createComponent(this.componentType);
        this.component.instance.dialogData = dialogData;
        this.opened = true;
      }
    });
  }

  public close(): void {
    if (this.component) {
      this.component.destroy();
    }
  }
}
