export default class Register<T> {
  private readonly _ts: T[] = []

  constructor(...ts: T[]) {
    this._ts = ts;
  }

  public getItem(index: number): T {
    return this._ts[index]
  }

  public setItem(index: number, t: T): void {
    this._ts[index] = t;
  }

  public push(...ts: T[]): void {
    this._ts.push(...ts);
  }

  public remove(t: T): boolean {
    const index = this._ts.indexOf(t);
    if (index >= 0) {
      this._ts.splice(index, 1);
      return true;
    }
    return false;
  }

  public pop(): T | undefined {
    return this._ts.pop()
  }

  public forEach(action: (item: T, index: number) => void): void {
    for (let i = 0; i < this._ts.length; i++) {
      action(this._ts[i], i);
    }
  }

  public filter(predicate: (item: T, index: number) => boolean): Register<T> {
    let newArr: T[] = [];
    for (let i = 0; i < this._ts.length; i++) {
      const item = this._ts[i]
      if (predicate(item, i)) {
        newArr.push(item);
      }
    }
    return new Register<T>(...newArr);
  }

  public map<TRes>(mapper: (item: T, index: number) => TRes): Register<TRes> {
    let newArr: TRes[] = [];
    for (let i = 0; i < this._ts.length; i++) {
      newArr.push(mapper(this._ts[i], i));
    }
    return new Register<TRes>(...newArr);
  }

  public find(predicate: (item: T, index: number) => boolean): T | undefined {
    for (let i = 0; i < this._ts.length; i++) {
      const item = this._ts[i]
      if (predicate(item, i)) {
        return item;
      }
    }
    return undefined;
  }
}
