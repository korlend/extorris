import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class UserShipModuleModel extends DBModel<UserShipModuleModel> {
  _tableName: string = "user_ship_modules";
  _entityType: EntityType = EntityType.USER_SHIP_MODULE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.SHIP })
  ship_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.SHIP_MODULE_TYPE,
  })
  module_type_id?: number;

  parseObject(
    object: DBModelOnlyDBData<UserShipModuleModel>,
  ): UserShipModuleModel {
    const instance = new UserShipModuleModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.module_type_id = object.module_type_id;
    return instance;
  }
}
