import FieldTypes from "@src/enums/FieldTypes.js";

export default class ModelPropertyMetadata {
  fieldType?: FieldTypes;
  isImmutable: boolean = false;
}
