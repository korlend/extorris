import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipModuleTypeModel extends DBModel<ShipModuleTypeModel> {
  _tableName: string = "ship_module_types";
  _entityType: EntityType = EntityType.SHIP_MODULE_TYPE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.TRANSLATION,
  })
  name_id?: number;

  @FieldType(FieldTypes.STRING)
  code_name: string = "";

  parseObject(
    object: DBModelOnlyDBData<ShipModuleTypeModel>,
  ): ShipModuleTypeModel {
    const instance = new ShipModuleTypeModel();
    instance.id = object.id;
    instance.name_id = object.name_id;
    instance.code_name = object.code_name;
    return instance;
  }
}
