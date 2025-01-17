import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "./DBModelOnlyDBData.js";

export type DBModelDBDataKeys<T extends DBModel<T>> = Exclude<keyof DBModelOnlyDBData<T>, undefined> & string