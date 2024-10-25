import type EntityInfoTypes from "~/enums/EntityInfoTypes";

export default interface EntityInfo {
  name: string;
  type: EntityInfoTypes;
  immutable: boolean;
  linked_entity_name?: string; // when type is entity_select
  values?: Array<string>; // when type select
  // TODO: permissions?: {};
}
