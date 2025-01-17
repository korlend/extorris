import DBModel from "@src/models/db/DBModel.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";

export default class MySQLSchemeGenerator<T extends DBModel<T>, K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>> {
  // checkEntity(entity: T) {
  //   const keys = Object.keys(entity.prepareREST());
  //   const keysMetadata: { [key: K]: any } = {};
  //   for (let i = 0; i < keys.length; i++) {
  //     const key = keys[i];
  //     const metadata = entity.getParameterAnnotations(key);
  //     keysMetadata[key] = metadata;
  //   }
  // }
}
