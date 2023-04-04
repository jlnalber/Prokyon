import { Component, OnInit } from '@angular/core';
import {Mode} from "../global/classes/modes/mode";
import {DrawerService} from "../services/drawer.service";
import MoveMode from "../global/classes/modes/moveMode";
import PointsMode from "../global/classes/modes/pointsMode";
import MovePointsMode from "../global/classes/modes/movePointsMode";
import LinesMode from "../global/classes/modes/linesMode";
import LineSegmentsMode from "../global/classes/modes/lineSegmentsMode";
import CircleMode from "../global/classes/modes/circleMode";
import BisectionTwoPointsMode from "../global/classes/modes/bisectionTwoPointsMode";
import ParallelMode from "../global/classes/modes/parallelMode";
import OrthogonalMode from "../global/classes/modes/orthogonalMode";
import IntersectionMode from "../global/classes/modes/intersectionMode";

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
    new ModeElement<MovePointsMode>(this.drawerService, () => {
      return new MovePointsMode();
    }, 'Verschieben', 'Verschiebe Punkte', 'filter_center_focus'),
    new ModeElement<PointsMode>(this.drawerService, () => {
      return new PointsMode();
    }, 'Punkte', 'Erstelle neue Punkte', 'adjust'),
    new ModeElement<LinesMode>(this.drawerService, () => {
      return new LinesMode();
    }, 'Gerade', 'Erstelle eine neue Gerade mit zwei Punkten', ''),
    new ModeElement<LineSegmentsMode>(this.drawerService, () => {
      return new LineSegmentsMode();
    }, 'Strecke', 'Erstelle eine neue Strecke zwischen zwei Punkten', ''),
    new ModeElement<CircleMode>(this.drawerService, () => {
      return new CircleMode();
    }, 'Kreis', 'Erstelle einen neuen Kreis mit zwei Punkten', ''),
    new ModeElement<BisectionTwoPointsMode>(this.drawerService, () => {
      return new BisectionTwoPointsMode();
    }, 'Mittelsenkrechte', 'Mache die Mittelsenkrechte zwischen zwei Punkten', ''),
    new ModeElement<ParallelMode>(this.drawerService, () => {
      return new ParallelMode();
    }, 'Parallel', 'Mache die Parallele zu einer Geraden durch einen Punkt', ''),
    new ModeElement<OrthogonalMode>(this.drawerService, () => {
      return new OrthogonalMode();
    }, 'Lot', 'Mache den Lot zu eine Geraden durch einen Punkt', ''),
    new ModeElement<IntersectionMode>(this.drawerService, () => {
      return new IntersectionMode();
    }, 'Schnittpunkt', 'Mache den Schnittpunkt zwischen Geraden, Strecken und Kreisen', '')
  ]

}

class ModeElement<T extends Mode> {
  public constructor(private drawerService: DrawerService, public getInstance: (create: boolean) => T, public title: string, public tooltip: string, public icon: string) {}

  public click(): void {
    this.drawerService.mode = this.getInstance(true);
  }

  public isActivated(): boolean {
    return this.drawerService.mode?.constructor === this.getInstance(false).constructor;
  }
}
