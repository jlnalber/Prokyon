import {Operation} from "./operation";
import {contains, indexOf, indexUntil, lastIndexOf, replaceAll, tryParseNumber} from "../../../essentials/utils";
import {Constant} from "./constants/constant";
import {Addition} from "./elementaryOperations/addition";
import {Variable} from "./variable";
import {Subtraction} from "./elementaryOperations/subtraction";
import {Multiplication} from "./elementaryOperations/multiplication";
import {Division} from "./elementaryOperations/division";
import {Pow} from "./elementaryOperations/pow";
import {Modulo} from "./elementaryOperations/modulo";
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
import {Root} from "./elementaryOperations/root";
import {NaturalLogarithm} from "./naturalLogarithm";
import {PiConstant} from "./constants/pi";
import {EConstant} from "./constants/e";

const powerOperators = [
  '^'
]
const pointOperators = [
  '*',
  '/',
  '%'
]
const lineOperators = [
  '+',
  '-'
]
const operations = [ ...powerOperators, ...lineOperators, ...pointOperators ]
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
const trigonometryFunctions = [
  'sin',
  'asin',
  'cos',
  'acos',
  'tan',
  'atan',
  'sec',
  'asec',
  'csc',
  'acsc',
  'cot',
  'acot'
];
const otherFunctions = [
  'ln',
  'sqrt'
];
const functions = [ ...trigonometryFunctions, ...otherFunctions ];
const notNumbersOrVariables = [ ...whitespaces, ...operations, ...brackets ];

const parseErrorMessage = 'syntax error';

export class OperationsParser {

  constructor(private readonly str: string) { }

  private formattedString: string | undefined;
  private stringSplit: string[] | undefined;
  private parseTree: BinaryTree<string> | undefined;
  private operation: Operation | undefined;

  public formatString(): string {
    if (!this.formattedString) {
      this.formattedString = replaceAll(this.str.trim(), '**', '^');
      this.formattedString = replaceAll(this.formattedString, 'arcsin', 'asin');
      this.formattedString = replaceAll(this.formattedString, 'arccos', 'acos');
      this.formattedString = replaceAll(this.formattedString, 'arctan', 'atan');
      this.formattedString = replaceAll(this.formattedString, 'arcsec', 'asec');
      this.formattedString = replaceAll(this.formattedString, 'arccsc', 'acsc');
      this.formattedString = replaceAll(this.formattedString, 'arccot', 'acot');
      this.formattedString = replaceAll(this.formattedString, 'π', 'pi');
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
          if ([...operations, ...whitespaces, ...brackets].indexOf(c) != -1 || [...operations, ...brackets].indexOf(str) != -1 || (tryParseNumber(str) && !tryParseNumber(str + c))) {
            push = true;
          }

          // push the str to the array
          if (push && str != '') {
            this.stringSplit.push(str);
            str = '';
          }
          if (whitespaces.indexOf(c) == -1) {
            str += c;
          }
        }
        if (str != '') {
          this.stringSplit.push(str);
        }

        // helper function
        let fromPowToEndOfExponent = (index: number): number => {
          try {
            if (this.stringSplit && contains(functions, this.stringSplit[index + 1])) {
              let nextEl = this.stringSplit[index + 2];
              if (contains(openingBrackets, nextEl)) {
                return indexUntil(this.stringSplit, openingBrackets, closingBrackets, index + 2, parseErrorMessage);
              }
              else if (contains(functions, nextEl)) {
                return fromPowToEndOfExponent(index + 1);
              }
              else {
                return index + 2;
              }
            }
            else if (this.stringSplit && contains(openingBrackets, this.stringSplit[index + 1])) {
              return indexUntil(this.stringSplit, openingBrackets, closingBrackets, index + 1, parseErrorMessage);
            }
            else {
              return index + 1;
            }
          }
          catch {
            throw parseErrorMessage;
          }
          throw parseErrorMessage;
        }

        // check whether additional elements have to be inserted
        for (let i = this.stringSplit.length - 2; i >= 0; i--) {

          // TODO: 5x^2 is interpreted as (5x)^2, --> problem: you can't just insert a *, example: sin 5x^2 should be (sin (5x))^2

          // first multiplication
          if (!(contains(openingBrackets, this.stringSplit[i])
            || contains(closingBrackets, this.stringSplit[i + 1])
            || contains(operations, this.stringSplit[i])
            || contains(operations, this.stringSplit[i + 1])
            || tryParseNumber(this.stringSplit[i + 1])
            || contains(functions, this.stringSplit[i]))) {

            // end index is needed for special cases like 5x^2 --> when you have a power
            let endIndex = indexUntil(this.stringSplit, openingBrackets, closingBrackets, i + 1, parseErrorMessage);

            if (contains(closingBrackets, this.stringSplit[i]) && contains(openingBrackets, this.stringSplit[i + 1])) {
              this.stringSplit.splice(i + 1, 0, '*');
            }
            // else if (!contains(functions, this.stringSplit[i]) && this.stringSplit.length >= i + 3 && this.s)
            else {
              this.stringSplit.splice(indexUntil(this.stringSplit, openingBrackets, closingBrackets, i + 1, parseErrorMessage) + 1, 0, ')');
              this.stringSplit.splice(i + 1, 0, '*');
              this.stringSplit.splice(indexUntil(this.stringSplit, closingBrackets, openingBrackets, i, parseErrorMessage, -1), 0, '(');
            }
            i++;
          }

          // then minus
          /*else if (this.stringSplit[i] == '-' && (i == 0 || contains([ ...openingBrackets, ...functions ], this.stringSplit[i - 1]))) {
            if (tryParseNumber(this.stringSplit[i + 1])) {
              this.stringSplit.splice(i, 1);
              this.stringSplit[i] = `-${this.stringSplit[i]}`;
              i--;
            }
            else if (!contains([ ...functions, ...openingBrackets ], this.stringSplit[i + 1])) {
              this.stringSplit.splice(i, 1);
              this.stringSplit.splice(i + 1, 0, ')')
              this.stringSplit.splice(i, 0, '(', '-1', '*');
              i--;
            }
          }*/

          // then plus
          else if (this.stringSplit[i] == '+' && (i == 0 || contains(openingBrackets, this.stringSplit[i - 1]))) {
            this.stringSplit.splice(i, 1);
            i++;
          }
        }
        // go over it for a second time (backwards)
        for (let i = this.stringSplit.length - 1; i >= 0; i--) {
          // do the minus again
          if (this.stringSplit[i] == '-') {
            // first when at start or after openingBrackets
            if (i == 0 || contains(openingBrackets, this.stringSplit[i - 1])) {
              this.stringSplit.splice(i, 1, '-1', '*');
              i += 2;
            }
            else if (contains(functions, this.stringSplit[i - 1])) {
              let endIndex = indexUntil(this.stringSplit, openingBrackets, closingBrackets, i + 1, parseErrorMessage);
              /*if (endIndex < this.stringSplit.length - 1 && this.stringSplit[endIndex + 1] == '^') {
                let endExponentIndex = fromPowToEndOfExponent(endIndex + 1);
                this.stringSplit.splice(endExponentIndex + 1, 0, ')', ')');
                this.stringSplit.splice(i, 1, '(', '-1', '*', '(')
                i += 6;
              }
              else {*/
                this.stringSplit.splice(i, 1);
                this.stringSplit.splice(endIndex, 0, ')');
                this.stringSplit.splice(i, 0, '(', '-1', '*');
                i += 3;
              //}
            }
          }
          /*
          if (this.stringSplit[i] == '-' && (i == 0 || contains([ ...openingBrackets, ...functions ], this.stringSplit[i - 1]))) {
            if (contains(functions, this.stringSplit[i + 1])) {
              this.stringSplit.splice(i, 1);
              this.stringSplit.splice(indexUntil(this.stringSplit, openingBrackets, closingBrackets, i + 1, parseErrorMessage) + 1, 0, ')')
              this.stringSplit.splice(i, 0, '(', '-1', '*');
              i--;
            }
            else if (contains(openingBrackets, this.stringSplit[i + 1])) {
              let indexTilEnd = indexUntil(this.stringSplit, openingBrackets, closingBrackets, i + 1, parseErrorMessage) + 1;
              if ((i == 0 || contains(openingBrackets, this.stringSplit[i - 1])) && (indexTilEnd ))
              this.stringSplit.splice(i, 1);
              this.stringSplit.splice(indexUntil(this.stringSplit, openingBrackets, closingBrackets, i, parseErrorMessage) + 1, 0, ')')
              this.stringSplit.splice(i, 0, '(', '-1', '*');
              i--;
            }
          }*/
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
            let el = arr[0];
            if (typeof el == 'string') {
              return {
                value: el
              };
            }
            return el;
          }
          /*else if (arr.length == 3) {
            let el0 = arr[0];
            let el1 = arr[1];
            let el2 = arr[2];
            if (typeof el0 == 'string' && openingBrackets.indexOf(el0) != -1 && (typeof el1 != 'string' || notNumbersOrVariables.indexOf(el1) == -1) && typeof el2 == 'string' && closingBrackets.indexOf(el2) != -1) {
              if (typeof el1 == 'string') {
                return {
                  value: el1
                };
              }
              return el1;
            }
            else if ((typeof el0 != 'string' || notNumbersOrVariables.indexOf(el0) == -1) && typeof el1 == 'string' && operations.indexOf(el1) != -1 && (typeof el2 != 'string' || notNumbersOrVariables.indexOf(el2) == -1)) {
              return {
                value: el1,
                first: arrToTree([ arr[0] ]),
                second: arrToTree([ arr[2] ])
              };
            }
            else {
              throw parseErrorMessage;
            }
          }*/
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
            while (contains(parseArray, ...functions)) {
              let startIndex = lastIndexOf(parseArray, ...functions);

              if (startIndex == parseArray.length - 1) throw parseErrorMessage;

              let func = parseArray[startIndex] as string;
              let param = parseArray[startIndex + 1];

              if (contains(brackets, param)) throw parseErrorMessage;
              if (contains(operations, param)) throw parseErrorMessage;

              // remove elements from array
              parseArray.splice(startIndex, 2, {
                value: func,
                first: arrToTree([ param ])
              });
            }

            // then, read in Powers, Points, Lines (ltr)
            for (let priority of [ powerOperators, pointOperators, lineOperators ]) {
              while (contains(parseArray, ...priority)) {
                let index = indexOf(parseArray, ...priority);
                if (index != -1 && index != 0 && index != parseArray.length - 1) {
                  let deletedItems = parseArray.splice(index - 1, 3);
                  let binaryTree: BinaryTree<string> = {
                    value: deletedItems[1] as string,
                    first: arrToTree([ deletedItems[0] ]),
                    second: arrToTree([ deletedItems[2] ])
                  };
                  parseArray.splice(index - 1, 0, binaryTree);
                }
                else {
                  throw parseErrorMessage;
                }
              }
            }

            if (parseArray.length == 1) {
              let el = parseArray[0];
              if (typeof el != 'string') {
                return el;
              }
            }
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

        let treeToOperation = (tree: BinaryTree<string>): Operation => {
          if (tryParseNumber(tree.value)) {
            return new Constant(parseFloat(tree.value));
          }
          else if (tree.value == '+' && tree.first != undefined && tree.second != undefined) {
            return new Addition(treeToOperation(tree.first), treeToOperation(tree.second));
          }
          else if (tree.value == '-' && tree.first != undefined && tree.second != undefined) {
            return new Subtraction(treeToOperation(tree.first), treeToOperation(tree.second));
          }
          else if (tree.value == '*' && tree.first != undefined && tree.second != undefined) {
            return new Multiplication(treeToOperation(tree.first), treeToOperation(tree.second));
          }
          else if (tree.value == '%' && tree.first != undefined && tree.second != undefined) {
            return new Modulo(treeToOperation(tree.first), treeToOperation(tree.second));
          }
          else if (tree.value == '/' && tree.first != undefined && tree.second != undefined) {
            return new Division(treeToOperation(tree.first), treeToOperation(tree.second));
          }
          else if (tree.value == '^' && tree.first != undefined && tree.second != undefined) {
            return new Pow(treeToOperation(tree.first), treeToOperation(tree.second));
          }

          // functions
          // trigonometry
          else if (tree.value == 'sin' && tree.first != undefined) {
            return new Sinus(treeToOperation(tree.first));
          }
          else if (tree.value == 'asin' && tree.first != undefined) {
            return new Arcussinus(treeToOperation(tree.first));
          }
          else if (tree.value == 'cos' && tree.first != undefined) {
            return new Cosinus(treeToOperation(tree.first));
          }
          else if (tree.value == 'acos' && tree.first != undefined) {
            return new Arcuscosinus(treeToOperation(tree.first));
          }
          else if (tree.value == 'tan' && tree.first != undefined) {
            return new Tangens(treeToOperation(tree.first));
          }
          else if (tree.value == 'atan' && tree.first != undefined) {
            return new Arcustangens(treeToOperation(tree.first));
          }
          else if (tree.value == 'sec' && tree.first != undefined) {
            return new Secans(treeToOperation(tree.first));
          }
          else if (tree.value == 'asec' && tree.first != undefined) {
            return new Arcussecans(treeToOperation(tree.first));
          }
          else if (tree.value == 'csc' && tree.first != undefined) {
            return new Cosecans(treeToOperation(tree.first));
          }
          else if (tree.value == 'acsc' && tree.first != undefined) {
            return new Arcuscosecans(treeToOperation(tree.first));
          }
          else if (tree.value == 'cot' && tree.first != undefined) {
            return new Cotangens(treeToOperation(tree.first));
          }
          else if (tree.value == 'acot' && tree.first != undefined) {
            return new Arcuscotangens(treeToOperation(tree.first));
          }
          // other functions
          else if (tree.value == 'ln' && tree.first != undefined) {
            return new NaturalLogarithm(treeToOperation(tree.first));
          }
          else if (tree.value == 'sqrt' && tree.first != undefined) {
            return new Root(treeToOperation(tree.first), new Constant(2));
          }

          // constants
          else if (tree.value == 'pi') {
            return new PiConstant();
          }
          else if (tree.value == 'e') {
            return new EConstant();
          }

          // else default to a variable
          else {
            return new Variable(tree.value);
          }

          //throw 'didn\'t understand tree';
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
