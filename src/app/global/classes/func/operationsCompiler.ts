import {Operation} from "./operations/operation";
import {contains, indexOf, replaceAll, tryParseNumber} from "../../essentials/utils";
import {Constant} from "./operations/constant";
import {Addition} from "./operations/elementaryOperations/addition";
import {Variable} from "./operations/variable";
import {Subtraction} from "./operations/elementaryOperations/subtraction";
import {Multiplication} from "./operations/elementaryOperations/multiplication";
import {Division} from "./operations/elementaryOperations/division";
import {Pow} from "./operations/elementaryOperations/pow";
import {Brackets} from "./operations/brackets";
import {Modulo} from "./operations/elementaryOperations/modulo";

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
const whitespaces = [
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
const notNumbersOrVariables = [ ...whitespaces, ...operations, ...brackets ];

const parseErrorMessage = 'syntax error';

export class OperationsCompiler {

  constructor(private readonly str: string) { }

  private formattedString: string | undefined;
  private stringSplit: string[] | undefined;
  private parseTree: BinaryTree<string> | undefined;
  private operation: Operation | undefined;

  public formatString(): string {
    if (!this.formattedString) {
      this.formattedString = replaceAll(this.str.trim(), '**', '^');
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

        // check whether additional elements have to be inserted
        for (let i = 0; i < this.stringSplit.length - 1; i++) {
          // first multiplication
          if (!(contains(openingBrackets, this.stringSplit[i]) || contains(closingBrackets, this.stringSplit[i + 1]) || contains(operations, this.stringSplit[i]) || contains(operations, this.stringSplit[i + 1]) || tryParseNumber(this.stringSplit[i + 1]))) {
            this.stringSplit.splice(i + 1, 0, '*');
            i--;
          }

          // then minus
          else if (this.stringSplit[i] == '-' && (i == 0 || contains(openingBrackets, this.stringSplit[i - 1]))) {
            this.stringSplit.splice(i, 1);
            if (tryParseNumber(this.stringSplit[i])) {
              this.stringSplit[i] = `-${this.stringSplit[i]}`;
            }
            else {
              this.stringSplit.splice(i, 0, '-1', '*');
            }
            i--;
          }

          // then plus
          else if (this.stringSplit[i] == '+' && (i == 0 || contains(openingBrackets, this.stringSplit[i - 1]))) {
            this.stringSplit.splice(i, 1);
            i--;
          }
        }
      }
      else {
        throw 'string not formatted yet';
      }
    }

    // return the result
    //console.log(this.stringSplit);
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
          else if (arr.length == 3) {
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
          }
          else {
            let parseArray: (string | BinaryTree<string>)[] = [ ...arr ]

            // first, read in the brackets
            while (contains(parseArray, ...openingBrackets)) {
              let startIndex = indexOf(parseArray, ...openingBrackets);
              let bracketsOpened = 1;
              let index = startIndex + 1;
              for (; bracketsOpened > 0 && index < parseArray.length; index++) {
                let el = parseArray[index];
                if (typeof el == 'string') {
                  if (openingBrackets.indexOf(el) != -1) {
                    bracketsOpened++;
                  }
                  if (closingBrackets.indexOf(el) != -1) {
                    bracketsOpened--;
                  }
                }
              }

              if (bracketsOpened == 0) {
                let removedElements = parseArray.splice(startIndex, index - startIndex);
                parseArray.splice(startIndex, 0, arrToTree(removedElements.splice(1, index - startIndex - 2)));
              }
              else {
                throw parseErrorMessage;
              }
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
    //console.log(this.parseTree);
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
          else if (tree.value == '' && tree.first != undefined) {
            return new Brackets(treeToOperation(tree.first));
          }
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
    //console.log(this.operation);
    return this.operation;
  }

  public compile(): Operation {
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
