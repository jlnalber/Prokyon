import {Operation} from "./operation";
import {
  contains,
  containsCombination,
  indexOf,
  indexUntil, isNumber,
  lastIndexOfCombination, mapElement,
  replaceAll,
  tryParseNumber
} from "../../../essentials/utils";
import {Constant} from "./constants/constant";
import {Addition} from "./elementary-operations/addition";
import {Variable} from "./variable";
import {Subtraction} from "./elementary-operations/subtraction";
import {Multiplication} from "./elementary-operations/multiplication";
import {Division} from "./elementary-operations/division";
import {Pow} from "./elementary-operations/pow";
import {Modulo} from "./elementary-operations/modulo";
import {Sinus} from "./trigonometry/sinus";
import {Cosinus} from "./trigonometry/cosinus";
import {Tangens} from "./trigonometry/tangens";
import {Secans} from "./trigonometry/secans";
import {Cosecans} from "./trigonometry/cosecans";
import {Cotangens} from "./trigonometry/cotangens";
import {Arcussinus} from "./trigonometry/arcussinus";
import {Arcuscosinus} from "./trigonometry/arcuscosinus";
import {Arcustangens} from "./trigonometry/arcustangens";
import {Arcussecans} from "./trigonometry/arcussecans";
import {Arcuscosecans} from "./trigonometry/arcuscosecans";
import {Arcuscotangens} from "./trigonometry/arcuscotangens";
import {Root} from "./elementary-operations/root";
import {NaturalLogarithm} from "./other-operations/naturalLogarithm";
import {PiConstant} from "./constants/pi";
import {EConstant} from "./constants/e";
import {ExternalFunction, FuncProvider} from "./externalFunction";
import {Absolute} from "./other-operations/Absolute";
import {Signum} from "./other-operations/signum";
import {SinusHyperbolicus} from "./trigonometry/sinusHyperbolicus";
import {CosinusHyperbolicus} from "./trigonometry/cosinusHyperbolicus";

const powerOperationsProviders: [string, (operation1: Operation, operation2: Operation) => Operation][] = [
  ['^', (op1, op2) => new Pow(op1, op2)]
]
const pointOperationProviders: [string, (operation1: Operation, operation2: Operation) => Operation][] = [
  ['*', (op1, op2) => new Multiplication(op1, op2)],
  ['/', (op1, op2) => new Division(op1, op2)],
  ['%', (op1, op2) => new Modulo(op1, op2)]
]
const lineOperationProviders: [string, (operation1: Operation, operation2: Operation) => Operation][] = [
  ['+', (op1, op2) => new Addition(op1, op2)],
  ['-', (op1, op2) => new Subtraction(op1, op2)]
]
const operationProviders = [ ...powerOperationsProviders, ...pointOperationProviders, ...lineOperationProviders ]

const powerOperators = powerOperationsProviders.map(p => p[0])
const pointOperators = pointOperationProviders.map(p => p[0])
const lineOperators = lineOperationProviders.map(p => p[0])
const operations = operationProviders.map(p => p[0])

const functionProviders: [string, (operation: Operation) => Operation][] = [
  ['sin', op => new Sinus(op)],
  ['asin', op => new Arcussinus(op)],
  ['csc', op => new Cosecans(op)],
  ['acsc', op => new Arcuscosecans(op)],
  ['cos', op => new Cosinus(op)],
  ['acos', op => new Arcuscosinus(op)],
  ['sec', op => new Secans(op)],
  ['asec', op => new Arcussecans(op)],
  ['tan', op => new Tangens(op)],
  ['atan', op => new Arcustangens(op)],
  ['cot', op => new Cotangens(op)],
  ['acot', op => new Arcuscotangens(op)],
  ['ln', op => new NaturalLogarithm(op)],
  ['sqrt', op => new Root(op, new Constant(2))],
  ['abs', op => new Absolute(op)],
  ['sgn', op => new Signum(op)],
  ['sinh', op => new SinusHyperbolicus(op)],
  ['cosh', op => new CosinusHyperbolicus(op)]
]
const constantProviders: [string, () => Operation][] = [
  ['pi', () => new PiConstant()],
  ['e', () => new EConstant()]
]

export const whitespaces = [
  ' ',
  '\t',
  '\r',
  '\n'
]
const openingBrackets = [
  '(',
  '['
]
const closingBrackets = [
  ')',
  ']'
]
const brackets = [ ...openingBrackets, ...closingBrackets ];
const notNumbersVariablesOrFunctions = [ ...whitespaces, ...operations, ...brackets ];
const stringMappings: [string, string][] = [
  ['**', '^'],
  ['²', '^2'],
  ['³', '^3']
]
const functionMappings: [string, string][] = [
  ['arcsin', 'asin'],
  ['arccos', 'acos'],
  ['arctan', 'atan'],
  ['arcsec', 'asec'],
  ['arccsc', 'acsc'],
  ['arccot', 'acot'],
  ['sign', 'sgn']
]
const variableMappings: [string, string][] = [
  ['π', 'pi']
]

const parseErrorMessage = 'syntax error';

export class OperationsParser {

  constructor(private readonly str: string, private readonly funcProvider: FuncProvider, private readonly changingVariables: (string | undefined)[] = []) { }

  private formattedString: string | undefined;
  private stringSplit: string[] | undefined;
  private parseTree: BinaryTree<string> | undefined;
  private operation: Operation | undefined;

  public formatString(): string {
    if (!this.formattedString) {
      this.formattedString = this.str.trim();
      for (let mapping of stringMappings) {
        this.formattedString = replaceAll(this.formattedString as string, mapping[0], mapping[1]);
      }
    }

    return this.formattedString;
  }

  public splitString(): string[] {
    // try to split the string
    if (!this.stringSplit) {
      if (this.formattedString) {
        this.stringSplit = [];

        // do the splitting
        let str = '';
        for (let i = 0; i < this.formattedString.length; i++) {
          let push = false;
          let c = this.formattedString.charAt(i);

          // check whether there has to be a split
          if ([...operations, ...whitespaces, ...brackets].indexOf(c) !== -1
            || [...operations, ...brackets].indexOf(str) !== -1
            || (isNumber(str) && !isNumber(str + c))) {
            push = true;
          }

          // push the str to the array
          if (push && str !== '') {
            this.stringSplit.push(str);
            str = '';
          }
          if (whitespaces.indexOf(c) === -1) {
            str += c;
          }
        }
        if (str != '') {
          this.stringSplit.push(str);
        }

        // check whether additional elements have to be inserted
        for (let i = 0; i < this.stringSplit.length - 1; i++) {

          // checking the following is obsolete, since I then want the functions to be treated as variables
          //check for functions that don't use brackets
          /*if (contains(functions, this.stringSplit[i]) && !contains(openingBrackets, this.stringSplit[i + 1])) {
            throw parseErrorMessage;
          }*/

          // first multiplication
          if (!(i + 1 == this.stringSplit.length // We don't want to insert a multiplication sign when we are at the end of the expression,...
            || contains(openingBrackets, this.stringSplit[i]) // ... we start with opening brackets, ...
            || contains(closingBrackets, this.stringSplit[i + 1]) // ... we end with closing brackets, ...
            || (contains(openingBrackets, this.stringSplit[i + 1])
              && !contains(closingBrackets, this.stringSplit[i])) // ... on the right, there is an opening bracket but on the left, there is not (this allows us to parse in functions s.a. f(x)), ...
              && !isNumber(this.stringSplit[i]) // (furthermore, there has to be a check whether the left part is a number, e.g. 5(1 + 1) should parse as 5 * (1 + 1) (?))
            || contains(operations, this.stringSplit[i]) // ... we have an operation on the left, ...
            || contains(operations, this.stringSplit[i + 1]) // ... we have an operation on the right or ...
            || isNumber(this.stringSplit[i + 1]) // ... the right part is a number, e.g. in (x - 3)5 (looks invalid?).
            // I believe this last case is obsolete. The third should already be enough.
            /*|| contains(functions, this.stringSplit[i])*/)) {

            this.stringSplit.splice(i + 1, 0, '*');
          }

          // then plus
          else if (this.stringSplit[i] == '+' && (i == 0 || contains(openingBrackets, this.stringSplit[i - 1]))) {
            this.stringSplit.splice(i, 1);
            i--;
          }

          // then minus
          else if (this.stringSplit[i] == '-' && (i == 0 || contains(openingBrackets, this.stringSplit[i - 1]))) {
            this.stringSplit.splice(i, 1, '-1', '*');
          }
        }
      }
      else {
        throw 'string not formatted yet';
      }
    }

    // return the result
    // console.log(this.stringSplit);
    return this.stringSplit;
  }

  public parseToTree(): BinaryTree<string> {
    if (!this.parseTree) {
      if (this.stringSplit) {

        // function for recursive use
        let arrToTree = (arr: (string | BinaryTree<string>)[]): BinaryTree<string> => {
          if (arr.length == 0) {
            throw parseErrorMessage;
          }
          else if (arr.length == 1) {
            // if there is only one element, and it is a string, it is either a number or a variable
            // for the variable, mapping might be required: e.g. 'π' --> 'pi'
            const el = arr[0];
            if (typeof el == 'string') {
              if (!contains(notNumbersVariablesOrFunctions, el)) {
                return {
                  value: mapElement(el, variableMappings)
                };
              }

              // this might occur when there is only a bracket, a times, etc. left (operations and brackets)
              throw parseErrorMessage;
            }
            return el;
          }
          else {
            let parseArray: (string | BinaryTree<string>)[] = [ ...arr ]

            // first, read in the brackets
            while (contains(parseArray, ...openingBrackets)) {
              // get the indexes of the brackets
              let startIndex = indexOf(parseArray, ...openingBrackets);
              let index = indexUntil(parseArray, openingBrackets, closingBrackets, startIndex, parseErrorMessage) + 1;

              // remove the elements and process them, then add
              let removedElements = parseArray.splice(startIndex, index - startIndex);
              parseArray.splice(startIndex, 0, arrToTree(removedElements.splice(1, index - startIndex - 2)));
            }

            // then, read in the functions
            let funcCond = (el1: string | BinaryTree<string>, el2: string | BinaryTree<string>): boolean => {
              return typeof el1 === 'string' && typeof el2 !== 'string' && !contains(notNumbersVariablesOrFunctions, el1);
            }
            while (containsCombination(parseArray, funcCond)) {
              // get the position of the function
              let startIndex = lastIndexOfCombination(parseArray, funcCond);

              // if the function is at the end, it is invalid
              if (startIndex == parseArray.length - 1) throw parseErrorMessage;

              // get the name of the function (mapped, meaning e.g. 'arcsin' --> 'asin')
              let func = mapElement(parseArray[startIndex] as string, functionMappings);
              let param = parseArray[startIndex + 1];

              if (contains(brackets, param)) throw parseErrorMessage;
              if (contains(operations, param)) throw parseErrorMessage;

              // remove elements from array and add the function
              parseArray.splice(startIndex, 2, {
                value: func,
                first: arrToTree([ param ])
              });
            }

            // then, read in Powers, Points, Lines (ltr)
            for (let priority of [ powerOperators, pointOperators, lineOperators ]) {
              while (contains(parseArray, ...priority)) {
                // get the index of the operation
                let index = indexOf(parseArray, ...priority);
                if (index != -1 && index != 0 && index != parseArray.length - 1) {
                  // remove the elements
                  let deletedItems = parseArray.splice(index - 1, 3);
                  let binaryTree: BinaryTree<string> = {
                    value: deletedItems[1] as string,
                    first: arrToTree([ deletedItems[0] ]),
                    second: arrToTree([ deletedItems[2] ])
                  };

                  // and then add the operation as a binary tree
                  parseArray.splice(index - 1, 0, binaryTree);
                }
                else {
                  throw parseErrorMessage;
                }
              }
            }

            // if only one element is left (BinaryTree), the BinaryTree has successfully been created
            if (parseArray.length == 1) {
              let el = parseArray[0];
              if (typeof el !== 'string') {
                return el;
              }
            }

            // something went wrong if nothing was returned until here
            throw parseErrorMessage;
          }
        }

        // calculate the parse tree
        this.parseTree = arrToTree(this.stringSplit);

      }
      else {
        throw 'string not split yet';
      }
    }

    // return the result
    // console.log(this.parseTree);
    return this.parseTree;
  }

  public createOperation(): Operation {
    if (!this.operation) {
      if (this.parseTree) {

        // function for recursive use
        let treeToOperation = (tree: BinaryTree<string>): Operation => {
          // try to parse each node in the binary tree to an operation
          if (tree.first !== undefined && tree.second !== undefined) {
            // This branch is about the operations.
            for (let operationProvider of operationProviders) {
              if (tree.value === operationProvider[0]) {
                return operationProvider[1](treeToOperation(tree.first), treeToOperation(tree.second));
              }
            }
          } else if (tree.first !== undefined && tree.second === undefined) {
            // Here, we are dealing with functions.
            for (let functionProvider of functionProviders) {
              if (tree.value === functionProvider[0]) {
                return functionProvider[1](treeToOperation(tree.first));
              }
            }

            // Otherwise, use an ExternalFunction
            return new ExternalFunction(tree.value, this.funcProvider, treeToOperation(tree.first));
          } else if (tree.first === undefined && tree.second === undefined) {
            // Here, we are dealing with numbers, constants or Variables.
            if (isNumber(tree.value)) {
              return new Constant(tryParseNumber(tree.value)!);
            }

            // Check for changing variables
            for (let i = 0; i < this.changingVariables.length; i++) {
              const c = this.changingVariables[i];
              if (c === tree.value) {
                return new Variable(tree.value, i);
              }
            }

            // constants
            for (let constantProvider of constantProviders) {
              if (tree.value === constantProvider[0]) {
                return constantProvider[1]();
              }
            }

            // else default to a variable
            return new Variable(tree.value);
          }

          // If we end up here, something didn't work out!
          throw parseErrorMessage;
        }

        this.operation = treeToOperation(this.parseTree);
      }
      else {
        throw 'tree not created yet';
      }
    }

    // return the operation
    // console.log(this.operation);
    return this.operation;
  }

  public parse(): Operation {
    // do all the operations after each other
    this.formatString();
    this.splitString();
    this.parseToTree();
    return this.createOperation();
  }

}

interface BinaryTree<T> {
  value: T,
  first?: BinaryTree<T>,
  second?: BinaryTree<T>
}
