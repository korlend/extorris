import "reflect-metadata";

import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import ModelPropertyMetadata from "@src/models/ModelPropertyMetadata.js";
import ModelPropertyMetadataTypes from "@src/enums/ModelPropertyMetadataTypes.js";

export default class MetadataHelper {
  static setPropertyMetadata<T extends IParsable<T>, T1 extends DBModel<T>>(
    key: string,
    value: any,
    target: T1,
    metadataType: ModelPropertyMetadataTypes,
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
        modelPropertyMetadata.fieldType = value;
        Reflect.defineMetadata(key, modelPropertyMetadata, target);
        break;
      case ModelPropertyMetadataTypes.IMMUTABLE:
        modelPropertyMetadata.isImmutable = !!value;
        Reflect.defineMetadata(key, modelPropertyMetadata, target);
        break;
    }
  }

  static getPropertyMetadata<T extends IParsable<T>, T1 extends DBModel<T>>(
    key: string,
    target: T1,
  ): ModelPropertyMetadata | null {
    const modelPropertyMetadata: ModelPropertyMetadata = Reflect.getMetadata(
      key,
      target,
    );
    return modelPropertyMetadata || null;
  }
}
