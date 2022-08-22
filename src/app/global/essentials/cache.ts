export default class Cache<TKey, TValue> {

  private dict: [TKey, TValue][];

  public getItem(key: TKey): TValue | undefined {
    for (let kvp of this.dict) {
      if (kvp[0] === key) {
        return kvp[1];
      }
    }
    return undefined;
  }

  public setItem(key: TKey, value: TValue): void {
    for (let i = 0; i < this.dict.length; i++) {
      if (this.dict[i][0] === key) {
        this.dict[i][1] = value;
        return;
      }
    }
    this.dict.push([key, value]);
  }

  public delItem(key: TKey): boolean {
    const index = this.indexOfKey(key);
    if (index >= 0) {
      this.dict.splice(index, 1);
      return true;
    }
    return false;
  }

  public hasKey(key: TKey): boolean {
    for (let kvp of this.dict) {
      if (kvp[0] === key) {
        return true;
      }
    }
    return false;
  }

  private indexOfKey(key: TKey): number {
    for (let i = 0; i < this.dict.length; i++) {
      if (this.dict[i][0] === key) {
        return i;
      }
    }
    return -1;
  }

  public get keys(): TKey[] {
    return this.dict.map(kvp => kvp[0]);
  }

  public get values(): TValue[] {
    return this.dict.map(kvp => kvp[1]);
  }

  public empty(): void {
    this.dict = [];
  }

  public get size(): number {
    return this.dict.length;
  }

  constructor(...keyValuePairs: [TKey, TValue][]) {
    this.dict = keyValuePairs;
  }
}
