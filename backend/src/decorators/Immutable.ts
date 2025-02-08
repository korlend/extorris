import MetadataHelper from "@src/core/decorators/MetadataHelper.js";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import { ModelPropertyMetadataTypes } from "extorris-common";

export default function Immutable<T extends DBModel<T>>(
  target: T,
  parameterName: DBModelDBDataKeys<T>,
) {
  MetadataHelper.setPropertyMetadata(
    parameterName,
    true,
    target,
    ModelPropertyMetadataTypes.IMMUTABLE,
  );
}
