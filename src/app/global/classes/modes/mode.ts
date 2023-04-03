import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {RenderingContext} from "../renderingContext";
import {DrawerService} from "../../../services/drawer.service";

export abstract class Mode {

  public abstract pointerMove(drawerService: DrawerService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void;

  public abstract click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void;
}
