import type EntityFieldTypes from "src/enums/EntityFieldTypes";

export default interface EntityInfo {
  name: string;
  type: EntityFieldTypes;
  immutable: boolean;
  linked_entity_name?: string; // when type is entity_select
  values?: Array<string>; // when type select
  // TODO: permissions?: {};
}
