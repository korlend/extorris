import MetadataHelper from "@src/core/decorators/MetadataHelper.js";
import ModelPropertyMetadataTypes from "@src/enums/ModelPropertyMetadataTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default function Immutable<T extends IParsable<T>>(
  target: DBModel<T>,
  parameterName: string,
) {
  MetadataHelper.setPropertyMetadata(
    parameterName,
    true,
    target,
    ModelPropertyMetadataTypes.IMMUTABLE,
  );
}
