import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipEnergyCoreModel extends DBModel<ShipEnergyCoreModel> {
  _tableName: string = "ship_energy_cores";
  _entityType: EntityType = EntityType.SHIP_ENERGY_CORE;

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
  energy_capacity: number = 0;

  @FieldType(FieldTypes.INT)
  energy_production: number = 0;

  parseObject(
    object: DBModelOnlyDBData<ShipEnergyCoreModel>,
  ): ShipEnergyCoreModel {
    const instance = new ShipEnergyCoreModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.code_name = object.code_name;
    instance.energy_capacity = object.energy_capacity;
    instance.energy_production = object.energy_production;
    return instance;
  }
}
