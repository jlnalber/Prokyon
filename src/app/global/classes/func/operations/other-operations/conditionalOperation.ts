import {Operation} from "../operation";

type Condition = (dict: any) => boolean;
type ConditionWithOperation = [ Condition, Operation ];

export class ConditionalOperation extends Operation {

  public evaluate(dict: any): number {
    for (let conditionWithOperation of this.conditionsWithOperations) {
      if (conditionWithOperation[0](dict)) {
        return conditionWithOperation[1].evaluate(dict);
      }
    }
    throw 'no condition matched';
  }

  public derive(key: string): Operation {
    return new ConditionalOperation(...this.conditionsWithOperations.map((cO: ConditionWithOperation): ConditionWithOperation => {
      return [ cO[0], cO[1].derive(key) ];
    }));
  }

  private readonly conditionsWithOperations: ConditionWithOperation[];

  constructor(...conditionsWithOperations: ConditionWithOperation[]) {
    super();
    this.conditionsWithOperations = conditionsWithOperations;
    this.childOperations.push(...conditionsWithOperations.map(item => item[1]))
  }

  public override simplify(): Operation {
    return new ConditionalOperation(...this.conditionsWithOperations.map((c0: ConditionWithOperation): ConditionWithOperation => {
      return [ c0[0], c0[1].simplify() ];
    }))
  }
}
