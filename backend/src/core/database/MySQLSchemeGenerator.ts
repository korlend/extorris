import DBModel from "@src/models/db/DBModel.js";

export default class MySQLSchemeGenerator {
  checkEntity<T extends DBModel<T>>(entity: T) {
    const keys = Object.keys(entity.prepareREST());
    const keysMetadata: { [key: string]: any } = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const metadata = entity.getParameterAnnotations(key);
      keysMetadata[key] = metadata;
    }
  }
}
