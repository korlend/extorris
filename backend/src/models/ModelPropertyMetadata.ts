import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";

export default class ModelPropertyMetadata {
  fieldType?: FieldTypes;
  isImmutable: boolean = false;
  fieldEntityType?: EntityType;
  stringList?: Array<string>;
}
