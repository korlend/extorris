import MetadataHelper from "@src/core/decorators/MetadataHelper.js";
import EntityType from "@src/enums/EntityType.js";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import { FieldTypes, ModelPropertyMetadataTypes } from "extorris-common";

export default function FieldType<T extends DBModel<T>, K extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>>(
  type: FieldTypes,
  options?: { fieldEntityType?: EntityType; stringList?: Array<string> },
) {
  return (target: T, parameterName: K) => {
    MetadataHelper.setPropertyMetadata(
      parameterName,
      type,
      target,
      ModelPropertyMetadataTypes.FIELD_TYPE,
      options,
    );
  };
}
