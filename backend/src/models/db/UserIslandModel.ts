import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import DBModel from "./DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";
import { FieldTypes } from "extorris-common";

export default class UserIslandModel extends DBModel<UserIslandModel> {
  _tableName: string = "user_islands";
  _entityType: EntityType = EntityType.USER_ISLAND;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.MAIN_MAP_HUB,
  })
  main_map_hub_id?: number;

  parseObject(object: DBModelOnlyDBData<UserIslandModel>): UserIslandModel {
    const instance = new UserIslandModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.main_map_hub_id = object.main_map_hub_id;
    return instance;
  }
}
