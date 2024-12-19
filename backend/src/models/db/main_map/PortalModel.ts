import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class PortalModel
  extends DBModel<PortalModel>
  implements IParsable<PortalModel>
{
  _tableName: string = "portals";
  _entityType: EntityType = EntityType.PORTAL;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.MAIN_MAP_HUB })
  from_hub_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.MAIN_MAP_HUB })
  to_hub_id?: number;

  @FieldType(FieldTypes.INT)
  from_hub_position_x: number = 0;

  @FieldType(FieldTypes.INT)
  from_hub_position_y: number = 0;

  @FieldType(FieldTypes.INT)
  to_hub_position_x: number = 0;

  @FieldType(FieldTypes.INT)
  to_hub_position_y: number = 0;

  parseObject(object: any): PortalModel {
    const instance = new PortalModel();
    instance.id = object.id;
    instance.from_hub_id = object.from_hub_id;
    instance.to_hub_id = object.to_hub_id;
    instance.from_hub_position_x = object.from_hub_position_x;
    instance.from_hub_position_y = object.from_hub_position_y;
    instance.to_hub_position_x = object.to_hub_position_x;
    instance.to_hub_position_y = object.to_hub_position_y;
    return instance;
  }
}
