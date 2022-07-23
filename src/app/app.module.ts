import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { FormulaEditorComponent } from './formula-editor/formula-editor.component';
import { FormulaComponent } from './formula-editor/formula/formula.component';
import { ContextMenuDirective } from './contextMenu/context-menu.directive';
import { ContextMenuComponent } from './contextMenu/context-menu/context-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    TabGroupComponent,
    FormulaEditorComponent,
    FormulaComponent,
    ContextMenuDirective,
    ContextMenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
