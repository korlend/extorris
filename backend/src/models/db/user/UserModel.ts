import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class UserModel extends DBModel<UserModel> {
  _tableName: string = "users";
  _entityType: EntityType = EntityType.USER;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.GUILD })
  guild_id?: number;

  @FieldType(FieldTypes.STRING)
  username: string = "";

  @FieldType(FieldTypes.STRING)
  email: string = "";

  @FieldType(FieldTypes.STRING)
  firstname: string = "";

  @FieldType(FieldTypes.STRING)
  surname: string = "";

  @FieldType(FieldTypes.STRING)
  phone: string = "";

  @FieldType(FieldTypes.STRING)
  password: string = "";

  @FieldType(FieldTypes.INT)
  login_attempts: number = 0;

  @FieldType(FieldTypes.STRING)
  verified: boolean = false;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created: Date | null = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated: Date | null = new Date();

  parseObject(object: DBModelOnlyDBData<UserModel>): UserModel {
    const instance = new UserModel();
    instance.id = object.id;
    instance.guild_id = object.guild_id;
    instance.username = object.username;
    instance.email = object.email;
    instance.firstname = object.firstname;
    instance.surname = object.surname;
    instance.phone = object.phone;
    instance.password = object.password;
    instance.login_attempts = object.login_attempts;
    instance.verified = !!object.verified;
    instance.created = object.created ? new Date(object.created) : null;
    instance.updated = object.updated ? new Date(object.updated) : null;
    return instance;
  }
}
