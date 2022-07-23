export abstract class Operation {
  public abstract evaluate(dict: any): number;
  public abstract derive(): Operation;
  public simplify(): Operation {
    return this;
  }
}
