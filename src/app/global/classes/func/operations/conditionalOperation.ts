import {Operation} from "./operation";

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

  private readonly conditionsWithOperations: ConditionWithOperation[];

  constructor(...conditionsWithOperations: ConditionWithOperation[]) {
    super();
    this.conditionsWithOperations = conditionsWithOperations;
  }
}
