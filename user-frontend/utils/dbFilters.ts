import FieldTypes from "~/core/enums/FieldTypes";
import DBFilter from "~/core/models/db/DBFilter";
import type ModelPropertyMetadata from "~/core/models/ModelPropertyMetadata";
import type { DBOperand } from "~/core/types/DBOperands";

export function createDBFilters(
  filters: { [key: string]: any },
  entityKeysMetadata: { [key: string]: ModelPropertyMetadata }
): Array<DBFilter> {
  const filterKeys = Object.keys(filters);
  const dbFilters: Array<DBFilter> = [];
  for (let i = 0; i < filterKeys.length; i++) {
    const key = filterKeys[i];
    let value = filters[key];
    const metadata = entityKeysMetadata[key];
    let operand = "=" as DBOperand;
    if (!metadata) {
      continue;
    }

    if (value === undefined || value === null || value === "") {
      continue;
    }
    if (
      metadata.fieldType === FieldTypes.STRING ||
      metadata.fieldType === FieldTypes.STRING_SELECT
    ) {
      value = `%${value}%`;
      operand = "like" as DBOperand;
    } else if (metadata.fieldType === FieldTypes.DATE) {
      if (value.from) {
        dbFilters.push(new DBFilter(key, value.from, ">="));
      }
      if (value.to) {
        dbFilters.push(new DBFilter(key, value.to, "<="));
      }
      break;
    }
    const dbFilter = new DBFilter(key, value, operand);
    dbFilters.push(dbFilter);
  }
  return dbFilters;
}
