import type FieldTypes from "src/enums/FieldTypes";

export default interface EntityInfo {
  name: string;
  type: FieldTypes;
  immutable: boolean;
  linked_entity_name?: string; // when type is entity_select
  values?: Array<string>; // when type select
  // TODO: permissions?: {};
}
