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

  public hasKey(key: TKey): boolean {
    for (let kvp of this.dict) {
      if (kvp[0] === key) {
        return true;
      }
    }
    return false;
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

  constructor(...keyValuePairs: [TKey, TValue][]) {
    this.dict = keyValuePairs;
  }
}
