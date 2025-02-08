import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class AdminModel extends DBModel<AdminModel> {
  _tableName: string = "admins";
  _entityType: EntityType = EntityType.ADMIN;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.ADMIN_ROLE,
  })
  role_id?: number;

  @FieldType(FieldTypes.STRING)
  username: string = "";

  @FieldType(FieldTypes.STRING)
  email: string = "";

  @FieldType(FieldTypes.STRING)
  firstname: string = "";

  @FieldType(FieldTypes.STRING)
  surname: string = "";

  @FieldType(FieldTypes.PASSWORD)
  password: string = "";

  @Immutable
  @FieldType(FieldTypes.DATE)
  created: Date | null = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated: Date | null = new Date();

  @FieldType(FieldTypes.INT)
  login_attempts: number = 0;

  parseObject(object: DBModelOnlyDBData<AdminModel>): AdminModel {
    const instance = new AdminModel();
    instance.id = object.id;
    instance.role_id = object.role_id;
    instance.username = object.username;
    instance.email = object.email;
    instance.firstname = object.firstname;
    instance.surname = object.surname;
    instance.password = object.password;
    instance.created = object.created ? new Date(object.created) : null;
    instance.updated = object.updated ? new Date(object.updated) : null;
    instance.login_attempts = object.login_attempts;
    return instance;
  }
}
