import DBModel from "@src/models/db/DBModel.js";

export type DBModelOnlyDBData<T extends DBModel<T>, K = Omit<T, `_${any}`>> = Pick<
  K,
  {
    [K1 in keyof K]: K[K1] extends Function ? never : K1;
  }[keyof K]
>;
