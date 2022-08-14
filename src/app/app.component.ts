import { Component } from '@angular/core';
import {Tab} from "./tab-group/tab-group.component";
import {FormulaEditorComponent} from "./formula-editor/formula-editor.component";
import {SettingsTabComponent} from "./settings-tab/settings-tab.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  tabs: Tab[] = [
    {
      title: 'Formeln',
      icon: 'functions',
      componentType: FormulaEditorComponent
    },
    {
      title: 'Einstellungen',
      icon: 'settings',
      componentType: SettingsTabComponent
    }
  ]
}
