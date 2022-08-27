import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BLACK, Color, getColorAsRgbaFunction} from "../../../global/interfaces/color";
import {HoverConfiguration} from "../../../hover-menu/hover-menu.directive";
import {ColorPickerComponent} from "../../../color-picker/color-picker.component";

@Component({
  selector: 'app-color-circle',
  templateUrl: './color-circle.component.html',
  styleUrls: ['./color-circle.component.css']
})
export class ColorCircleComponent implements OnInit {

  @Input() public color: Color = BLACK;
  @Output() public colorChange: EventEmitter<Color> = new EventEmitter<Color>();

  @Input() public visible: boolean = true;
  @Output() public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public changeVisibility(): void {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }

  public get colorStr(): string {
    return getColorAsRgbaFunction(this.color);
  }

  public get hoverMenu(): HoverConfiguration {
    return {
      component: ColorPickerComponent,
      data: {
        getter: () => {
          return this.color;
        },
        setter: (c: Color) => {
          this.color = c;
          this.colorChange.emit(c);
        }
      }
    };
  }

}
