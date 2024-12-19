import type { DBLogical } from "~/core/types/DBLogical";
import type { DBOperand } from "~/core/types/DBOperands";

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
