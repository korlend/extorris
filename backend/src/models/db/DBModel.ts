import "reflect-metadata";

import * as changeCase from "change-case";

import ParametersLimit from "@src/models/ParametersLimit.js";
import MetadataHelper from "@src/core/decorators/MetadataHelper.js";
import ModelPropertyMetadata from "../ModelPropertyMetadata.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";
import DBModelRESTExclude from "@src/enums/DBModelRESTExclude.js";

export default abstract class DBModel<T extends DBModel<T>> {
  // [key: string]: any

  abstract id: number;
  deleted?: boolean = undefined;
  abstract _tableName: string;
  abstract _entityType: EntityType;
  // name: string = '';
  // title: string = '';
  // link: string = '';
  // src: string = '';

  // _hashKeysExclude: Array<string> = [];
  /**
   * transform values before writing in db
   * key - param name
   * value - type of value transformation
   */
  // _migrationExclude: Array<string> = [];
  _crudExclude: Array<string> = [];
  _RESTExclude: Array<string> = Object.values(DBModelRESTExclude);
  // protected _excludeSerializationParams: Array<string> = ['_hashKeysExclude', '_transformParamsValues', '_excludeSerializationParams', '_migrationExclude', '_crudExclude'];

  // hash(excludeKeys: Array<DBModelDBDataKeys<T> | keyof DBModelRESTExclude> = []): string {
  //   excludeKeys = [...excludeKeys, 'id', 'is_local', 'deleted', ...this._excludeSerializationParams, ...this._hashKeysExclude]
  //   return hash(this, {
  //     excludeKeys: (key: string) => {
  //       if (excludeKeys.includes(key)) {
  //         return true
  //       }
  //       return false
  //     }
  //   })
  // }

  // toObjectForHash(fields: ParametersLimit<T> = new ParametersLimit()): Object {
  //   fields.exclude = [...fields.exclude, 'id', 'is_local', 'deleted', ...this._excludeSerializationParams, ...this._hashKeysExclude]
  //   return this.toSnakeObject(fields)
  // }

  // cutHash(fields: ParametersLimit = new ParametersLimit()) {
  //   return hash(this.toObjectForHash(fields))
  // }

  // equal(model: Model, fields: ParametersLimit = new ParametersLimit()) {
  //   return this.cutHash(fields) === model.cutHash(fields)
  // }

  getValue(name: DBModelDBDataKeys<T>) {
    // @ts-expect-error: otherwise [key: string]: any
    return this[name];
  }

  getParameterAnnotations(parameterName: DBModelDBDataKeys<T>): ModelPropertyMetadata {
    return MetadataHelper.getPropertyMetadata<T>(parameterName, this as DBModel<T> as T);
  };

  isImmutable(parameterName: DBModelDBDataKeys<T>): boolean {
    return !!MetadataHelper.getPropertyMetadata<T>(parameterName, this as DBModel<T> as T)?.isImmutable;
  }

  hasDeleted(): boolean {
    return this.deleted !== undefined;
  }

  toObject(fields: ParametersLimit<T> = new ParametersLimit()): DBModelOnlyDBData<T> {
    const entries = this.getEntries(fields);
    return Object.fromEntries(entries) as DBModelOnlyDBData<T>;
  }

  fromArrayObject(array: Array<DBModelOnlyDBData<T>>): Array<T> {
    return array && array.length ? array.map((v) => this.parseObject(v)) : [];
  }

  abstract parseObject(object: DBModelOnlyDBData<T>): T;

  prepareREST(): DBModelOnlyDBData<T> {
    // @ts-ignore
    return this.toObject(new ParametersLimit<T>(this._RESTExclude)) as DBModelOnlyDBData<T>;
  }

  getEntries(fields: ParametersLimit<T> = new ParametersLimit()): [DBModelDBDataKeys<T>, T[DBModelDBDataKeys<T>]][] {
    fields.exclude = [...fields.exclude];
    const entries = Object.entries(this);
    const fixedEntries: [DBModelDBDataKeys<T>, any][] = [];
    const ignoreValues = fields.ignoreValues;
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      const value = entries[i][1];
      if (fields.only.length && !fields.only.includes(name as DBModelDBDataKeys<T>)) {
        continue;
      }
      if (
        name.startsWith("_") ||
        (fields.exclude && fields.exclude.includes(name as DBModelDBDataKeys<T>))
      ) {
        continue;
      }
      if (typeof value === "function") {
        continue;
      }
      if (ignoreValues && ignoreValues.length && ignoreValues.includes(value)) {
        continue;
      }
      fixedEntries.push([name as DBModelDBDataKeys<T>, value]);
    }
    return fixedEntries;
  }

  getParamsAndValues(
    fields: ParametersLimit<T> = new ParametersLimit(),
  ): Map<DBModelDBDataKeys<T>, T[DBModelDBDataKeys<T>]> {
    const entries = this.getEntries(fields);
    const map = new Map<DBModelDBDataKeys<T>, T[DBModelDBDataKeys<T>]>();
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      const value = entries[i][1];
      map.set(name, value);
    }
    return map;
  }

  parametersKeys(
    fields: ParametersLimit<T> = new ParametersLimit(),
  ): Array<DBModelDBDataKeys<T>> {
    fields.exclude = [...fields.exclude];
    const entries = this.getEntries(fields);
    const array: Array<DBModelDBDataKeys<T>> = [];
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      if (!this.hasDeleted() && name === "deleted") {
        continue;
      }
      array.push(name);
    }
    return array;
  }

  parametersValues(
    fields: ParametersLimit<T> = new ParametersLimit(),
  ): Array<T[DBModelDBDataKeys<T>]> {
    const entries = this.getEntries(fields);
    const array = [];
    for (let i = 0; i < entries.length; i++) {
      let value = entries[i][1];
      array.push(value);
    }
    return array;
  }
}
