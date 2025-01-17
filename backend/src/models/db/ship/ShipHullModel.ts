import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipHullModel extends DBModel<ShipHullModel> {
  _tableName: string = "ship_hulls";
  _entityType: EntityType = EntityType.SHIP_HULL;

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
  cannon_slots: number = 0;

  @FieldType(FieldTypes.FLOAT)
  energy_consumption_factor: number = 0;

  @FieldType(FieldTypes.INT)
  maximum_crew: number = 0;

  @FieldType(FieldTypes.FLOAT)
  speed_factor: number = 0;

  @FieldType(FieldTypes.INT)
  health_points: number = 0;

  parseObject(object: DBModelOnlyDBData<ShipHullModel>): ShipHullModel {
    const instance = new ShipHullModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.code_name = object.code_name;
    instance.cannon_slots = object.cannon_slots;
    instance.energy_consumption_factor = object.energy_consumption_factor;
    instance.maximum_crew = object.maximum_crew;
    instance.speed_factor = object.speed_factor;
    instance.health_points = object.health_points;
    return instance;
  }
}
