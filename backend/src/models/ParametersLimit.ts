import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import DBModel from "./db/DBModel.js";

export default class ParametersLimit<T extends DBModel<T>, K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>> {
  include: Array<K>;
  exclude: Array<K>;
  excludeReturn: Array<K>;
  ignoreValues: Array<K>;

  constructor(
    include: Array<K> = [],
    exclude: Array<K> = [],
    excludeReturn: Array<K> = [],
    ignoreValues: Array<K> = [],
  ) {
    this.include = include;
    this.exclude = exclude;
    this.excludeReturn = excludeReturn;
    this.ignoreValues = ignoreValues;
  }
}
