import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import ShipPartSubtypes from "@src/enums/ShipPartSubtypes.js";

export default class UserShipPartModel
  extends DBModel<UserShipPartModel>
  implements IParsable<UserShipPartModel>
{
  _tableName: string = "user_ship_parts";
  _entityType: EntityType = EntityType.USER_SHIP_PART;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.SHIP })
  ship_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.SHIP_PART_TYPE,
  })
  ship_part_type_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.SHIP_PART_SUBTYPE,
  })
  subtype_id: number = 0;

  @FieldType(FieldTypes.INT)
  speed_change: number = 0;

  @FieldType(FieldTypes.INT)
  physical_defense_change: number = 0;

  @FieldType(FieldTypes.INT)
  maximum_crew_change: number = 0;

  @FieldType(FieldTypes.INT)
  max_weight_change: number = 0;

  @FieldType(FieldTypes.INT)
  attack_power_change: number = 0;

  @FieldType(FieldTypes.INT)
  energy_consumption_change: number = 0;

  parseObject(object: any): UserShipPartModel {
    const instance = new UserShipPartModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.ship_id = object.ship_id;
    instance.ship_part_type_id = object.ship_part_type_id;
    instance.subtype_id = object.subtype_id;
    instance.speed_change = object.speed_change;
    instance.physical_defense_change = object.physical_defense_change;
    instance.maximum_crew_change = object.maximum_crew_change;
    instance.max_weight_change = object.max_weight_change;
    instance.attack_power_change = object.attack_power_change;
    instance.energy_consumption_change = object.energy_consumption_change;
    return instance;
  }
}
