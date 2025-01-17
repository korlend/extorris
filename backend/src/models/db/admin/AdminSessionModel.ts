import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class AdminSessionModel extends DBModel<AdminSessionModel> {
  _tableName: string = "admin_sessions";
  _entityType: EntityType = EntityType.ADMIN_SESSION;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.ADMIN })
  admin_id?: number;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created: Date | null = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated: Date | null = new Date();

  @FieldType(FieldTypes.DATE)
  expire: Date | null = null;

  @FieldType(FieldTypes.STRING)
  token: string = "";

  parseObject(object: DBModelOnlyDBData<AdminSessionModel>): AdminSessionModel {
    const instance = new AdminSessionModel();
    instance.id = object.id;
    instance.admin_id = object.admin_id;
    instance.created = object.created ? new Date(object.created) : null;
    instance.updated = object.updated ? new Date(object.updated) : null;
    instance.expire = object.expire ? new Date(object.expire) : null;
    instance.token = object.token;
    return instance;
  }
}
