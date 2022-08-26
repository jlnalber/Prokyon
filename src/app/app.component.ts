import {Component, ViewContainerRef} from '@angular/core';
import {Tab} from "./tab-group/tab-group.component";
import {FormulaTabComponent} from "./formula-tab/formula-tab.component";
import {SettingsTabComponent} from "./settings-tab/settings-tab.component";
import {DialogService} from "./dialog/dialog.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private readonly ds: DialogService, private readonly viewContainerRef: ViewContainerRef) {
    this.ds.rootViewContainerRef = this.viewContainerRef;
  }

  tabs: Tab[] = [
    {
      title: 'Formeln',
      icon: 'functions',
      componentType: FormulaTabComponent
    },
    {
      title: 'Einstellungen',
      icon: 'settings',
      componentType: SettingsTabComponent
    }
  ]
}
