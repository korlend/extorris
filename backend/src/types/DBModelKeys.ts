import DBModel from "@src/models/db/DBModel.js";

export type DBModelKeys<T extends DBModel<T>> = keyof T;
