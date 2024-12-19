import "reflect-metadata";

import * as changeCase from "change-case";

import ParametersLimit from "@src/models/ParametersLimit.js";
import IParsable from "@src/interfaces/IParsable.js";
import MetadataHelper from "@src/core/decorators/MetadataHelper.js";
import ModelPropertyMetadata from "../ModelPropertyMetadata.js";
import EntityType from "@src/enums/EntityType.js";

export default abstract class DBModel<T extends IParsable<T>> {
  // [key: string]: any

  id: number = 0;
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
  _transformParamsValues: Map<string, string> = new Map();
  // _migrationExclude: Array<string> = [];
  _crudExclude: Array<string> = [];
  _RESTExclude: Array<string> = [
    "_transformParamsValues",
    "_crudExclude",
    "_RESTExclude",
    "password",
    "deleted",
  ];
  // protected _excludeSerializationParams: Array<string> = ['_hashKeysExclude', '_transformParamsValues', '_excludeSerializationParams', '_migrationExclude', '_crudExclude'];

  // hash(excludeKeys: Array<string> = []): string {
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

  // toObjectForHash(fields: ParametersLimit = new ParametersLimit()): Object {
  //   fields.exclude = [...fields.exclude, 'id', 'is_local', 'deleted', ...this._excludeSerializationParams, ...this._hashKeysExclude]
  //   return this.toSnakeObject(fields)
  // }

  // cutHash(fields: ParametersLimit = new ParametersLimit()) {
  //   return hash(this.toObjectForHash(fields))
  // }

  // equal(model: Model, fields: ParametersLimit = new ParametersLimit()) {
  //   return this.cutHash(fields) === model.cutHash(fields)
  // }

  getValue(name: string) {
    // @ts-expect-error: otherwise [key: string]: any
    return this[name];
  }

  getParameterAnnotations(parameterName: string): ModelPropertyMetadata {
    return MetadataHelper.getPropertyMetadata(parameterName, this);
  };

  isImmutable(parameterName: string): boolean {
    return !!MetadataHelper.getPropertyMetadata(parameterName, this)?.isImmutable;
  }

  hasDeleted(): boolean {
    return this.deleted !== undefined;
  }

  toObject(fields: ParametersLimit = new ParametersLimit()): Object {
    const entries = this.getEntries(fields);
    return Object.fromEntries(entries);
  }

  fromArrayObject(obj: any): Array<any> {
    return obj && obj.length ? obj.map((v: any) => this.parseObject(v)) : [];
  }

  abstract parseObject(object: any): T;

  prepareREST(): any {
    return this.toObject(new ParametersLimit(this._RESTExclude));
  }

  getEntries(fields: ParametersLimit = new ParametersLimit()): [string, any][] {
    fields.exclude = [...fields.exclude];
    const entries = Object.entries(this);
    const fixedEntries: [string, any][] = [];
    const ignoreValues = fields.ignoreValues;
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      const value = entries[i][1];
      if (fields.only.length && !fields.only.includes(name)) {
        continue;
      }
      if (
        name.startsWith("_") ||
        (fields.exclude && fields.exclude.includes(name))
      ) {
        continue;
      }
      if (typeof value === "function") {
        continue;
      }
      if (ignoreValues && ignoreValues.length && ignoreValues.includes(value)) {
        continue;
      }
      fixedEntries.push([name, value]);
    }
    return fixedEntries;
  }

  getParamsAndValues(
    fields: ParametersLimit = new ParametersLimit(),
  ): Map<string, any> {
    const entries = this.getEntries(fields);
    const map = new Map<string, any>();
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      const value = entries[i][1];
      map.set(name, value);
    }
    return map;
  }

  toSnakeObject(fields: ParametersLimit = new ParametersLimit()): any {
    const entries = this.getEntries(fields);
    const map = new Map();
    for (let i = 0; i < entries.length; i++) {
      const name = changeCase.snakeCase(entries[i][0]);
      let value = entries[i][1];
      if (value && typeof value === "object" && value.length) {
        value = value.map((v: any) =>
          v.toSnakeObject ? v.toSnakeObject() : v,
        );
      }
      map.set(name, value);
    }
    return Object.fromEntries(map.entries());
  }

  parametersKeys(
    fields: ParametersLimit = new ParametersLimit(),
  ): Array<string> {
    fields.exclude = [...fields.exclude];
    const entries = this.getEntries(fields);
    const array = [];
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      if (!this.hasDeleted() && name === "deleted") {
        continue;
      }
      array.push(name);
    }
    return array;
  }

  parametersKeysSnake(
    fields: ParametersLimit = new ParametersLimit(),
    prefix: string = "",
  ): Array<string> {
    return this.parametersKeys(fields).map((v) => {
      return prefix
        ? `${prefix}.${changeCase.snakeCase(v)}`
        : `\`${changeCase.snakeCase(v)}\``;
    });
  }

  parametersValues(
    fields: ParametersLimit = new ParametersLimit(),
  ): Array<string> {
    const entries = this.getEntries(fields);
    const array = [];
    const tpv = this._transformParamsValues;
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i][0];
      let value = entries[i][1];
      if (value && tpv.has(name)) {
        if (tpv.get(name) === "stringify" && typeof value === "object") {
          value = JSON.stringify(value);
        }
      }
      array.push(value);
    }
    return array;
  }
}
