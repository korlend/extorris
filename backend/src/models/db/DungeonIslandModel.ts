import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class DungeonIslandModel
  extends DBModel<DungeonIslandModel>
  implements IParsable<DungeonIslandModel>
{
  _tableName: string = "dungeon_islands";
  _entityType: EntityType = EntityType.DUNGEON_ISLAND;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.MAIN_MAP_HUB,
  })
  main_map_hub_id: string = "";

  parseObject(object: any): DungeonIslandModel {
    const instance = new DungeonIslandModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.main_map_hub_id = object.main_map_hub_id;
    return instance;
  }
}
