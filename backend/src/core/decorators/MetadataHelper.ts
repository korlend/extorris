import "reflect-metadata";

import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import ModelPropertyMetadata from "@src/models/ModelPropertyMetadata.js";
import ModelPropertyMetadataTypes from "@src/enums/ModelPropertyMetadataTypes.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";

export default class MetadataHelper {
  static setPropertyMetadata<T extends DBModel<T>, K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>>(
    key: K,
    value: any,
    target: T,
    metadataType: ModelPropertyMetadataTypes,
    options?: { fieldEntityType?: EntityType; stringList?: Array<string> },
  ) {
    let modelPropertyMetadata: ModelPropertyMetadata = Reflect.getMetadata(
      key,
      target,
    );

    if (!modelPropertyMetadata) {
      modelPropertyMetadata = new ModelPropertyMetadata();
    }

    switch (metadataType) {
      case ModelPropertyMetadataTypes.FIELD_TYPE:
        switch (value as FieldTypes) {
          case FieldTypes.ENTITY_SELECT:
            if (options?.fieldEntityType) {
              modelPropertyMetadata.fieldEntityType = options.fieldEntityType;
            }
          case FieldTypes.STRING_SELECT:
            if (options?.stringList) {
              modelPropertyMetadata.stringList = options.stringList;
            }
          default:
            modelPropertyMetadata.fieldType = value;
            Reflect.defineMetadata(key, modelPropertyMetadata, target);
            break;
        }
        break;
      case ModelPropertyMetadataTypes.IMMUTABLE:
        modelPropertyMetadata.isImmutable = !!value;
        Reflect.defineMetadata(key, modelPropertyMetadata, target);
        break;
    }
  }

  static getPropertyMetadata<T extends DBModel<T>, K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>>(
    key: K,
    target: T,
  ): ModelPropertyMetadata {
    const modelPropertyMetadata: ModelPropertyMetadata = Reflect.getMetadata(
      key,
      target,
    );
    if (!modelPropertyMetadata) {
      return new ModelPropertyMetadata();
    }
    return modelPropertyMetadata;
  }
}
