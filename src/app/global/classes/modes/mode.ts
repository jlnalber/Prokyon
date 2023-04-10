import {Point} from "../../interfaces/point";
import {PointerContext} from "../pointerController";
import {RenderingContext} from "../renderingContext";
import {DrawerService} from "../../../services/drawer.service";
import {Color} from "../../interfaces/color";

export abstract class Mode {

  public abstract pointerMove(drawerService: DrawerService, renderingContext: RenderingContext, from: Point, to: Point, pointerContext: PointerContext): void;

  public abstract click(drawerService: DrawerService, renderingContext: RenderingContext, point: Point, pointerContext: PointerContext): void;

  public transformInvisibleColor: undefined | ((c: Color) => Color);
}
