import { FieldTypes } from "../index";

export default class ModelPropertyMetadata {
  fieldType?: FieldTypes;
  isImmutable: boolean = false;
  fieldEntityType?: string;
  stringList?: Array<string>;
}
