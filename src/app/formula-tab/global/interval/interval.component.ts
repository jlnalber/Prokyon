import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css']
})
export class IntervalComponent {

  private _from: number = 0;
  get fromForTemplate(): number {
    return this._from;
  }
  set fromForTemplate(value: number) {
    this._from = value;
    this.fromChange.emit(value);
  }
  @Input() public set from(value: number) {
    this._from = value;
  }
  @Output() public fromChange: EventEmitter<number> = new EventEmitter<number>();

  private _to: number = 0;
  get toForTemplate(): number {
    return this._to;
  }
  set toForTemplate(value: number) {
    this._to = value;
    this.toChange.emit(value);
  }
  @Input() public set to(value: number) {
    this._to = value;
  }
  @Output() public toChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() noMargin: boolean = false;

}
