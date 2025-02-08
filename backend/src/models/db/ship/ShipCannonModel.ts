import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ShipCannonModel extends DBModel<ShipCannonModel> {
  _tableName: string = "ship_cannons";
  _entityType: EntityType = EntityType.SHIP_CANNON;

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
  attack_power: number = 0;

  @FieldType(FieldTypes.INT)
  energy_consumption_per_action: number = 0;

  @FieldType(FieldTypes.INT)
  action_cooldown: number = 0;

  parseObject(object: DBModelOnlyDBData<ShipCannonModel>): ShipCannonModel {
    const instance = new ShipCannonModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.code_name = object.code_name;
    instance.attack_power = object.attack_power;
    instance.energy_consumption_per_action =
      object.energy_consumption_per_action;
    instance.action_cooldown = object.action_cooldown;
    return instance;
  }
}
