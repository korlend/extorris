import DBModel from "@src/models/db/DBModel.js";

export type DBModelNotFunctions<T extends DBModel<T>> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;
