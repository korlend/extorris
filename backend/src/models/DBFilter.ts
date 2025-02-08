import DBModel from "./db/DBModel.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";

import { DBFilterSection, DBLogical, DBOperand } from "extorris-common";

// TODO: rework filters
export default class DBFilter<
  T extends DBModel<T>,
  K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>,
> {
  name: K;
  value: T[K];
  operand: DBOperand;
  logical: DBLogical;
  section?: DBFilterSection;

  constructor(
    name: K,
    value: T[K],
    operand: DBOperand = "=",
    logical: DBLogical = "AND",
    section?: DBFilterSection,
  ) {
    this.name = name;
    this.value = value;
    this.operand = operand;
    this.logical = logical;
    this.section = section;
  }

  static parseObject(object: any): DBFilter<any> {
    return new DBFilter(
      object.name,
      object.value,
      object.operand,
      object.logical,
      object.section,
    );
  }

  static parseObjects(array: Array<any>): Array<DBFilter<any>> {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      const object = array[i];
      arr.push(DBFilter.parseObject(object));
    }
    return arr;
  }
}
