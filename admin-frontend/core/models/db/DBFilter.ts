import type { DBLogical } from "extorris-common";
import type { DBOperand } from "extorris-common";

export default class DBFilter {
  name: string;
  value: string | number;
  operand: DBOperand;
  logical: DBLogical;

  constructor(
    name: string,
    value: string | number,
    operand: DBOperand,
    logical: DBLogical = "AND",
  ) {
    this.name = name;
    this.value = value;
    this.operand = operand;
    this.logical = logical;
  }
}
