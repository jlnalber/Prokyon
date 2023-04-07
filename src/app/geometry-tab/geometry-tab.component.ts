import { Component, OnInit } from '@angular/core';
import {Mode} from "../global/classes/modes/mode";
import {DrawerService} from "../services/drawer.service";
import MoveMode from "../global/classes/modes/moveMode";
import PointsMode from "../global/classes/modes/pointsMode";
import MovePointsMode from "../global/classes/modes/movePointsMode";
import LinesMode from "../global/classes/modes/linesMode";
import LineSegmentsMode from "../global/classes/modes/lineSegmentsMode";
import CircleMode from "../global/classes/modes/circleMode";
import BisectionMode from "../global/classes/modes/bisectionMode";
import ParallelMode from "../global/classes/modes/parallelMode";
import OrthogonalMode from "../global/classes/modes/orthogonalMode";
import IntersectionMode from "../global/classes/modes/intersectionMode";
import MiddlePointMode from "../global/classes/modes/middlePointMode";
import AngleBisectorMode from "../global/classes/modes/angleBisectorMode";
import TangensMode from "../global/classes/modes/tangensMode";

@Component({
  selector: 'app-geometry-tab',
  templateUrl: './geometry-tab.component.html',
  styleUrls: ['./geometry-tab.component.css']
})
export class GeometryTabComponent implements OnInit {

  constructor(private drawerService: DrawerService) { }

  ngOnInit(): void {
  }

  public groups: Group[] = [
    {
      name: 'Bewege',
      modes: [
        new ModeElement<MoveMode>(this.drawerService, () => {
          return new MoveMode();
        }, 'Bewegen', 'Bewege den Canvas und wähle Elemente aus', 'move'),
        new ModeElement<MovePointsMode>(this.drawerService, () => {
          return new MovePointsMode();
        }, 'Verschieben', 'Verschiebe Punkte', 'movePoints')
      ]
    },
    {
      name: 'Einfache Konstruktionen',
      modes: [
        new ModeElement<PointsMode>(this.drawerService, () => {
          return new PointsMode();
        }, 'Punkte', 'Erstelle neue Punkte', 'points'),
        new ModeElement<LinesMode>(this.drawerService, () => {
          return new LinesMode();
        }, 'Gerade', 'Erstelle eine neue Gerade mit zwei Punkten', 'line'),
        new ModeElement<LineSegmentsMode>(this.drawerService, () => {
          return new LineSegmentsMode();
        }, 'Strecke', 'Erstelle eine neue Strecke zwischen zwei Punkten', 'lineSegment'),
        new ModeElement<CircleMode>(this.drawerService, () => {
          return new CircleMode();
        }, 'Kreis', 'Erstelle einen neuen Kreis mit zwei Punkten', 'circle')
      ]
    },
    {
      name: 'Weiter Konstruktionen',
      modes: [
        new ModeElement<IntersectionMode>(this.drawerService, () => {
          return new IntersectionMode();
        }, 'Schnittpunkt', 'Mache den Schnittpunkt zwischen Geraden, Strecken und Kreisen', 'intersection'),
        new ModeElement<MiddlePointMode>(this.drawerService, () => {
          return new MiddlePointMode();
        }, 'Mittelpunkt', 'Mache den Mittelpunkt einer Strecke oder zwischen zwei Punkten', 'middlePoint'),
        new ModeElement<BisectionMode>(this.drawerService, () => {
          return new BisectionMode();
        }, 'Mittelsenk.', 'Mache die Mittelsenkrechte einer Strecke oder zwischen zwei Punkten', 'bisection'),
        new ModeElement<AngleBisectorMode>(this.drawerService, () => {
          return new AngleBisectorMode();
        }, 'Winkelhalb.', 'Mache die Winkelhalbierende von drei Punkten', 'angleBisector'),
        new ModeElement<ParallelMode>(this.drawerService, () => {
          return new ParallelMode();
        }, 'Parallel', 'Mache die Parallele zu einer Geraden durch einen Punkt', 'parallel'),
        new ModeElement<OrthogonalMode>(this.drawerService, () => {
          return new OrthogonalMode();
        }, 'Lot', 'Mache den Lot zu eine Geraden durch einen Punkt', 'orthogonal'),
        new ModeElement<TangensMode>(this.drawerService, () => {
          return new TangensMode();
        }, 'Tangente', 'Mache die Tangente an einen Kreis durch einen Punkt', 'tangens')
      ]
    }
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

interface Group {
  name: string,
  modes: ModeElement<Mode>[]
}
