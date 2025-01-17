import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipModel extends DBModel<ShipModel> {
  _tableName: string = "ships";
  _entityType: EntityType = EntityType.SHIP;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.MAIN_MAP_HUB,
  })
  main_map_hub_id?: number;

  @FieldType(FieldTypes.STRING)
  name: string = "";

  @FieldType(FieldTypes.BOOLEAN)
  is_parked: boolean = false;

  parseObject(object: DBModelOnlyDBData<ShipModel>): ShipModel {
    const instance = new ShipModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.main_map_hub_id = object.main_map_hub_id;
    instance.name = object.name;
    instance.is_parked = object.is_parked;
    return instance;
  }
}
