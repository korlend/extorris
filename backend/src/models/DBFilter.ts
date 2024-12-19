import IParsable from "@src/interfaces/IParsable.js";
import DBLogicals from "@src/types/DBLogicals.js";
import DBOperands from "@src/types/DBOperands.js";

export default class DBFilter {
  name: string;
  value: any;
  operand: DBOperands;
  logical: DBLogicals;

  constructor(
    name: string,
    value: any,
    operand: DBOperands = "=",
    logical: DBLogicals = "AND",
  ) {
    this.name = name;
    this.value = value;
    this.operand = operand;
    this.logical = logical;
  }

  static parseObject(object: any): DBFilter {
    return new DBFilter(
      object.name,
      object.value,
      object.operand,
      object.logical,
    );
  }

  static parseObjects(array: Array<any>): Array<DBFilter> {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      const object = array[i];
      arr.push(
        new DBFilter(object.name, object.value, object.operand, object.logical),
      );
    }
    return arr;
  }
}
