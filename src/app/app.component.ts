import {Component, ViewContainerRef} from '@angular/core';
import {Tab} from "./tab-group/tab-group.component";
import {FormulaTabComponent} from "./formula-tab/formula-tab.component";
import {SettingsTabComponent} from "./settings-tab/settings-tab.component";
import {DialogService} from "./dialog/dialog.service";
import {SnackbarService} from "./snackbar/snackbar.service";
import {GeometryTabComponent} from "./geometry-tab/geometry-tab.component";
import { MJ } from './services/drawer.service';

declare const MathJax: MJ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private readonly dialogService: DialogService, private readonly snackbarService: SnackbarService, private readonly viewContainerRef: ViewContainerRef) {
    this.dialogService.rootViewContainerRef = this.viewContainerRef;
    this.snackbarService.rootViewContainerRef = this.viewContainerRef;
  }

    renderMathToSvg(latex: string) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, () => {
        const math = MathJax.Hub.getAllJax()[0];
        MathJax.Hub.Queue(['Text', math, latex]);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, () => {
          const svg = math.root.toSVG();
          this.displaySvg(svg);
        }]);
      }]);
    }

    displaySvg(svg: string) {
      console.log(svg)
      const svgContainer = document.getElementById('svg-container');
      if (svgContainer) {
        svgContainer.innerHTML = svg;
      }
    }

  tabs: Tab[] = [
    {
      title: 'Formeln',
      icon: 'functions',
      componentType: FormulaTabComponent
    },
    {
      title: 'Geometrie',
      icon: 'radio_button_unchecked',
      componentType: GeometryTabComponent
    },
    {
      title: 'Einstellungen',
      icon: 'settings',
      componentType: SettingsTabComponent
    }
  ]
}
