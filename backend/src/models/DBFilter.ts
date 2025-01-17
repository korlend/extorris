import DBLogicals from "@src/types/DBLogicals.js";
import DBOperands from "@src/types/DBOperands.js";
import DBModel from "./db/DBModel.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";

export default class DBFilter<
  T extends DBModel<T>,
  K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>,
> {
  name: K;
  value: T[K];
  operand: DBOperands;
  logical: DBLogicals;

  constructor(
    name: K,
    value: T[K],
    operand: DBOperands = "=",
    logical: DBLogicals = "AND",
  ) {
    this.name = name;
    this.value = value;
    this.operand = operand;
    this.logical = logical;
  }

  static parseObject(object: any): DBFilter<any> {
    return new DBFilter(
      object.name,
      object.value,
      object.operand,
      object.logical,
    );
  }

  static parseObjects(array: Array<any>): Array<DBFilter<any>> {
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
