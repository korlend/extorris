import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class MainMapHubModel
  extends DBModel<MainMapHubModel>
  implements IParsable<MainMapHubModel>
{
  _tableName: string = "main_map_hubs";
  _entityType: EntityType = EntityType.MAIN_MAP_HUB;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.MAIN_MAP })
  main_map_id?: number;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created: Date | null = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated: Date | null = new Date();

  @FieldType(FieldTypes.INT)
  contamination_level: number = 0;

  @FieldType(FieldTypes.INT)
  on_depth: number = 0;

  @FieldType(FieldTypes.INT)
  hub_number: number = 0;

  parseObject(object: any): MainMapHubModel {
    const instance = new MainMapHubModel();
    instance.id = object.id;
    instance.main_map_id = object.main_map_id;
    instance.created = object.created ? new Date(object.created) : null;
    instance.updated = object.updated ? new Date(object.updated) : null;
    instance.contamination_level = object.contamination_level;
    instance.on_depth = object.on_depth;
    instance.hub_number = object.hub_number;
    return instance;
  }
}
