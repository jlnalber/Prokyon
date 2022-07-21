import {AfterViewInit, Component, ComponentRef, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css']
})
export class TabGroupComponent implements OnInit, AfterViewInit {

  private currentComponent: ComponentRef<any> | undefined;
  private _currentTab: Tab | undefined;
  public get currentTab(): Tab | undefined {
    return this._currentTab;
  }
  public set currentTab(value: Tab | undefined) {
    if (value != this.currentTab) {
      if (this.currentComponent) this.currentComponent.destroy();
      if (value) {
        this.currentComponent = this.tabPage.createComponent(value.componentType);
      }
      this._currentTab = value;
    }
  }

  @Input() tabs: Tab[] = [];

  @ViewChild('tabPage', { read: ViewContainerRef }) tabPage!: ViewContainerRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.currentTab = this.tabs[0];
    }, 0);
  }

  onTabClick(tab: Tab) {
    if (this.currentTab == tab) {
      this.currentTab = undefined;
    }
    else {
      this.currentTab = tab;
    }
  }

}

export interface Tab {
  title: string,
  icon?: string,
  componentType: Type<any>
}
