import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import HubLinksTypes from "@src/enums/HubLinksTypes.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class MainMapModel extends DBModel<MainMapModel> {
  _tableName: string = "main_maps";
  _entityType: EntityType = EntityType.MAIN_MAP;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created?: Date = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated?: Date = new Date();

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.ITERATION,
  })
  iteration_id?: number;

  @FieldType(FieldTypes.INT)
  layer: number = 0;

  @FieldType(FieldTypes.INT)
  map_depth: number = 0;

  @FieldType(FieldTypes.STRING_SELECT, {
    stringList: Object.values(HubLinksTypes),
  })
  hub_links_type?: HubLinksTypes;

  parseObject(object: DBModelOnlyDBData<MainMapModel>): MainMapModel {
    const instance = new MainMapModel();
    instance.id = object.id;
    instance.created = object.created ? new Date(object.created) : undefined;
    instance.updated = object.updated ? new Date(object.updated) : undefined;
    instance.iteration_id = object.iteration_id;
    instance.layer = object.layer;
    instance.map_depth = object.map_depth;
    instance.hub_links_type = object.hub_links_type;
    return instance;
  }
}
