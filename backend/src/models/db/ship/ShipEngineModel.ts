import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipEngineModel extends DBModel<ShipEngineModel> {
  _tableName: string = "ship_engines";
  _entityType: EntityType = EntityType.SHIP_ENGINE;

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
  max_speed: number = 0;

  @FieldType(FieldTypes.INT)
  acceleration: number = 0;

  @FieldType(FieldTypes.INT)
  energy_consumption: number = 0;

  parseObject(object: DBModelOnlyDBData<ShipEngineModel>): ShipEngineModel {
    const instance = new ShipEngineModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.code_name = object.code_name;
    instance.max_speed = object.max_speed;
    instance.acceleration = object.acceleration;
    instance.energy_consumption = object.energy_consumption;
    return instance;
  }
}
