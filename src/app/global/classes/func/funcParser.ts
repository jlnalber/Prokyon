import {Func} from "./func";
import {OperationsParser, whitespaces} from "./operations/operationsParser";
import {strContains, strIndexOf} from "../../essentials/utils";
import {FuncProvider} from "./operations/externalFunction";

interface FuncMetaData {
  name?: string,
  variable?: string
}

const splitError = 'couldn\'t split the function';

const splitChars = [
  '='
]

export class FuncParser {

  constructor(private readonly str: string, private readonly funcProvider: FuncProvider) { }

  private funcMetaData: FuncMetaData | undefined;
  private funcOperation: string | undefined;
  private func: Func | undefined;

  public splitString(): [ FuncMetaData, string ] {
    // split the string and read in the data
    if (!this.funcOperation || !this.funcMetaData) {
      // check for the chars where to split
      if (strContains(this.str, ...splitChars)) {
        const index = strIndexOf(this.str, ...splitChars);
        let namePart = this.str.slice(0, index).trim();
        let operationsPart = this.str.slice(index + 1, this.str.length);

        // throw error when there are multiple occurrences of the splitChars or the name part doesn't exist
        if (strContains(operationsPart, ...splitChars) || namePart.length === 0) {
          throw splitError;
        }
        this.funcOperation = operationsPart;

        // now evaluate the name part of the string
        if (namePart == 'y') {
          this.funcMetaData = {
            variable: 'x'
          };
        }
        else {
          // split the string by the brackets
          let splitString = namePart.split(/(\(|\))/).map(s => {
            return s.trim();
          }).filter(s => {
            return s !== '';
          });

          // get the name
          // case: f(x) = ...
          if (splitString.length === 4
            && !strContains(splitString[0], ...whitespaces)
            && !strContains(splitString[2], ...whitespaces)
            && splitString[1] == '(' && splitString[3] == ')'
            && splitString[0].length !== 0
            && 'abcdefghijklmnopqrstuvwxyz_'.indexOf(splitString[0].charAt(0).toLowerCase()) !== -1) {
            this.funcMetaData = {
              name: splitString[0],
              variable: splitString[2]
            };
          }
          else {
            throw splitError;
          }
        }
      }
      else {
        // this case is when there is no
        this.funcOperation = this.str;
        this.funcMetaData = {};
      }
    }
    return [ this.funcMetaData, this.funcOperation ];
  }

  public parseOperation(): Func {
    // parse the operation, then put it in a func and return it
    if (this.funcOperation && this.funcMetaData) {
      if (!this.func) {
        let opParser = new OperationsParser(this.funcOperation, this.funcProvider);
        let operation = opParser.parse();
        this.func = new Func(operation, this.funcMetaData.name, this.funcMetaData.variable);
      }
      return this.func;
    }
    throw 'func not split yet!';
  }

  public parse(): Func {
    // the whole parse process
    this.splitString();
    return this.parseOperation();
  }
}
