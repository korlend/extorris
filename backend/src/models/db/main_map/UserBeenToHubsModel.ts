import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class UserBeenToHubsModel
  extends DBModel<UserBeenToHubsModel>
  implements IParsable<UserBeenToHubsModel>
{
  _tableName: string = "user_been_to_hubs";
  _entityType: EntityType = EntityType.USER_BEEN_TO_HUBS;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.MAIN_MAP_HUB })
  hub_id?: number;

  parseObject(object: any): UserBeenToHubsModel {
    const instance = new UserBeenToHubsModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.hub_id = object.hub_id;
    return instance;
  }
}