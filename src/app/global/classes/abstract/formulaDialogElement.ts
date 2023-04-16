import {CanvasElement} from "./canvasElement";
import {Dialog} from "../../../dialog/dialog";

export default abstract class FormulaDialogElement {
  public abstract dialogData: CanvasElement;

  public dialog!: Dialog<FormulaDialogElement>;
}
