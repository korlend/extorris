import MetadataHelper from "@src/core/decorators/MetadataHelper.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import ModelPropertyMetadataTypes from "@src/enums/ModelPropertyMetadataTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default function FieldType<T extends IParsable<T>>(type: FieldTypes) {
  return (target: DBModel<T>, parameterName: string) => {
    MetadataHelper.setPropertyMetadata(
      parameterName,
      type,
      target,
      ModelPropertyMetadataTypes.FIELD_TYPE,
    );
  };
}
