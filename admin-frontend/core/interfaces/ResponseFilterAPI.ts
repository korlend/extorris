import type FieldTypes from "../enums/FieldTypes";

export default interface ResponseFilterAPI<T = any> {
  items: Array<T>;
  total: number;
  loadedLinkedEntities?: Record<number, Record<FieldTypes, any>>;
}
