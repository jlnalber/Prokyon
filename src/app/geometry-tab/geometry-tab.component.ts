import { Component, OnInit } from '@angular/core';
import {Mode} from "../global/classes/abstract/mode";
import {DrawerService} from "../services/drawer.service";
import MoveMode from "../global/classes/modes/moveMode";
import PointsMode from "../global/classes/modes/pointsMode";

@Component({
  selector: 'app-geometry-tab',
  templateUrl: './geometry-tab.component.html',
  styleUrls: ['./geometry-tab.component.css']
})
export class GeometryTabComponent implements OnInit {

  constructor(private drawerService: DrawerService) { }

  ngOnInit(): void {
  }

  public modeElements: ModeElement<Mode>[] = [
    new ModeElement<MoveMode>(this.drawerService, () => {
      return new MoveMode();
    }, 'Bewegen', 'Bewege den Canvas und wähle Elemente aus', 'control_camera'),
    new ModeElement<PointsMode>(this.drawerService, () => {
      return new PointsMode();
    }, 'Punkte', 'Erstelle neue Punkte', 'adjust')
  ]

}

class ModeElement<T extends Mode> {
  public constructor(private drawerService: DrawerService, public getInstance: () => T, public title: string, public tooltip: string, public icon: string) {}

  public click(): void {
    this.drawerService.mode = this.getInstance();
  }

  public isActivated(): boolean {
    return this.drawerService.mode?.constructor === this.getInstance().constructor;
  }
}
