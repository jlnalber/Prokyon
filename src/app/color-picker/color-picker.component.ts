import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Color, getColorAsRgbaFunction} from "../global/interfaces/color";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {

  r: number = 0;
  g: number = 0;
  b: number = 0;

  constructor(private readonly ref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  private _data: Provider<Color> | undefined;
  public get data(): Provider<Color> | undefined {
    return this._data;
  }
  public set data(value: Provider<Color> | undefined) {
    this._data = value;
    let color = this.data?.getter();
    if (color) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
    }
    this.ref.detectChanges();
  }

  public get colorStr(): string {
    if (this.data) {
      return getColorAsRgbaFunction(this.data.getter());
    }
    return '';
  }

  input() {
    let r = this.r < 0 ? 0 : this.r > 255 ? 255 : this.r;
    let g = this.g < 0 ? 0 : this.g > 255 ? 255 : this.g;
    let b = this.b < 0 ? 0 : this.b > 255 ? 255 : this.b;

    this.data?.setter({
      r: r,
      g: g,
      b: b,
      a: this.data?.getter().a
    })
  }
}

export interface Provider<T> {
  getter: () => T,
  setter: (t: T) => void
}
