import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { FormulaTabComponent } from './formula-tab/formula-tab.component';
import { GraphFormulaComponent } from './formula-tab/graph-formula/graph-formula.component';
import { ContextMenuDirective } from './context-menu/context-menu.directive';
import { ContextMenuComponent } from './context-menu/context-menu/context-menu.component';
import { HoverMenuDirective } from './hover-menu/hover-menu.directive';
import { HoverMenuComponent } from './hover-menu/hover-menu/hover-menu.component';
import {FormsModule} from "@angular/forms";
import {ColorPickerComponent} from "./color-picker/color-picker.component";
import { SettingsTabComponent } from './settings-tab/settings-tab.component';
import { FormulaElementComponent } from './formula-tab/formula-element/formula-element.component';
import { VariableFormulaComponent } from './formula-tab/variable-formula/variable-formula.component';
import { DialogComponent } from './dialog/dialog/dialog.component';
import { FuncAnalyserDialogComponent } from './func-analyser-dialog/func-analyser-dialog.component';
import { PointFormulaComponent } from './formula-tab/point-formula/point-formula.component';
import {ColorCircleComponent} from "./formula-tab/global/color-circle/color-circle.component";
import { SnackbarComponent } from './snackbar/snackbar/snackbar.component';
import { IntersectionDialogComponent } from './intersection-dialog/intersection-dialog.component';
import { DependencyPointElementsFormulaComponent } from './formula-tab/dependency-point-elements-formula/dependency-point-elements-formula.component';
import { DefiniteIntegralFormulaComponent } from './formula-tab/definite-integral-formula/definite-integral-formula.component';
import { IntervalComponent } from './formula-tab/global/interval/interval.component';
import { ViewDependencyPointElementsDialogComponent } from './formula-dialogs/view-dependency-point-elements-dialog/view-dependency-point-elements-dialog.component';
import { GeometryTabComponent } from './geometry-tab/geometry-tab.component';
import { GeometricFormulaComponent } from './formula-tab/geometric-formula/geometric-formula.component';
import { ScreenshotDialogComponent } from './screenshot-dialog/screenshot-dialog.component';
import { ViewPointElementComponent } from './formula-dialogs/view-point-element/view-point-element.component';
import { ViewAbstractLineElementComponent } from './formula-dialogs/view-abstract-line-element/view-abstract-line-element.component';
import { ViewCircleElementComponent } from './formula-dialogs/view-circle-element/view-circle-element.component';
import { ViewAngleElementComponent } from './formula-dialogs/view-angle-element/view-angle-element.component';
import { CompiledPointFormulaComponent } from './formula-tab/compiled-point-formula/compiled-point-formula.component';
import { CurveFormulaComponent } from './formula-tab/curve-formula/curve-formula.component';
import { ViewCurveElementComponent } from './formula-dialogs/view-curve-element/view-curve-element.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    ColorCircleComponent,
    SettingsTabComponent,
    FormulaElementComponent,
    VariableFormulaComponent,
    ColorPickerComponent,
    DialogComponent,
    FuncAnalyserDialogComponent,
    PointFormulaComponent,
    ColorCircleComponent,
    SnackbarComponent,
    IntersectionDialogComponent,
    DependencyPointElementsFormulaComponent,
    DefiniteIntegralFormulaComponent,
    IntervalComponent,
    ViewDependencyPointElementsDialogComponent,
    GeometryTabComponent,
    GeometricFormulaComponent,
    ScreenshotDialogComponent,
    ViewPointElementComponent,
    ViewAbstractLineElementComponent,
    ViewCircleElementComponent,
    ViewAngleElementComponent,
    CompiledPointFormulaComponent,
    CurveFormulaComponent,
    ViewCurveElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
