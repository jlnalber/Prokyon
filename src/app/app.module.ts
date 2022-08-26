import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { FormulaTabComponent } from './formula-tab/formula-tab.component';
import { GraphFormulaComponent } from './formula-tab/graph-formula/graph-formula.component';
import { ContextMenuDirective } from './contextMenu/context-menu.directive';
import { ContextMenuComponent } from './contextMenu/context-menu/context-menu.component';
import { HoverMenuDirective } from './hover-menu/hover-menu.directive';
import { HoverMenuComponent } from './hover-menu/hover-menu/hover-menu.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import {FormsModule} from "@angular/forms";
import { SettingsTabComponent } from './settings-tab/settings-tab.component';
import { FormulaElementComponent } from './formula-tab/formula-element/formula-element.component';
import { VariableFormulaComponent } from './formula-tab/variable-formula/variable-formula.component';
import { DialogComponent } from './dialog/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    TabGroupComponent,
    FormulaTabComponent,
    GraphFormulaComponent,
    ContextMenuDirective,
    ContextMenuComponent,
    HoverMenuDirective,
    HoverMenuComponent,
    ColorPickerComponent,
    SettingsTabComponent,
    FormulaElementComponent,
    VariableFormulaComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
