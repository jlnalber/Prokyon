import {Event} from "./event";

export default class Selection<T> {
  private _ts: T[] = [];

  public onSelectionChanged: Event<T[] | T> = new Event<T[] | T>();

  public empty(): void {
    const oldTs = this._ts;
    this._ts = [];
    this.onSelectionChanged.emit(oldTs);
  }

  public set(value: T | undefined): void {
    if (value !== undefined) {
      this._ts = [value];
    }
    else {
      this._ts = [];
    }
    this.onSelectionChanged.emit(value);
  }

  public add(value: T | undefined): boolean {
    if (value === undefined || this.contains(value)) {
      return false;
    }
    this._ts.push(value);
    this.onSelectionChanged.emit(value);
    return true;
  }

  public remove(value: T | undefined): boolean {
    if (value === undefined) {
      return false;
    }

    const index = this._ts.indexOf(value);
    if (index >= 0) {
      this._ts.splice(index, 1);
      this.onSelectionChanged.emit(value);
      return true;
    }
    return false;
  }

  public contains(value: T | undefined): boolean {
    return value === undefined || this._ts.indexOf(value) !== -1;
  }

  public alternate(value: T | undefined): boolean {
    if (value === undefined) {
      return false;
    }
    else if (this.contains(value)) {
      this.remove(value);
      return false;
    }
    else {
      this.add(value);
      return true;
    }
  }

  public toArray(): T[] {
    return this._ts.slice();
  }

  public get size(): number {
    return this._ts.length;
  }
}
