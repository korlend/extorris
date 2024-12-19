import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class UserSessionModel
  extends DBModel<UserSessionModel>
  implements IParsable<UserSessionModel>
{
  _tableName: string = "user_sessions";
  _entityType: EntityType = EntityType.USER_SESSION;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created?: Date;

  @FieldType(FieldTypes.DATE)
  expire?: Date;

  @FieldType(FieldTypes.STRING)
  token: string = "";

  parseObject(object: any): UserSessionModel {
    const instance = new UserSessionModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.created = object.created ?? new Date(object.created);
    instance.expire = object.expire ?? new Date(object.expire);
    instance.token = object.token;
    return instance;
  }
}
