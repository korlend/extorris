import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipArmorModel extends DBModel<ShipArmorModel> {
  _tableName: string = "ship_armors";
  _entityType: EntityType = EntityType.SHIP_ARMOR;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.SHIP })
  ship_id: number | null = null;

  @FieldType(FieldTypes.STRING)
  code_name: string = "";

  @FieldType(FieldTypes.INT)
  defense: number = 0;

  parseObject(object: DBModelOnlyDBData<ShipArmorModel>): ShipArmorModel {
    const instance = new ShipArmorModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.code_name = object.code_name;
    instance.defense = object.defense;
    return instance;
  }
}
