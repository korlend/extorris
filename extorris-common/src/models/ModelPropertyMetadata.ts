import FieldTypes from "../enums/FieldTypes";

export default class ModelPropertyMetadata {
  fieldType?: FieldTypes;
  isImmutable: boolean = false;
  fieldEntityType?: string;
  stringList?: Array<string>;
}
