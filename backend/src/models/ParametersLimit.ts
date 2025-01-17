import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import DBModel from "./db/DBModel.js";

export default class ParametersLimit<T extends DBModel<T>, K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>> {
  exclude: Array<K>;
  only: Array<K>;
  excludeReturn: Array<K>;
  ignoreValues: Array<K>;

  constructor(
    exclude: Array<K> = [],
    only: Array<K> = [],
    excludeReturn: Array<K> = [],
    ignoreValues: Array<K> = [],
  ) {
    this.exclude = exclude;
    this.only = only;
    this.excludeReturn = excludeReturn;
    this.ignoreValues = ignoreValues;
  }
}
