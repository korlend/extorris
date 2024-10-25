import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class AdminModel
  extends DBModel<AdminModel>
  implements IParsable<AdminModel>
{
  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;
  role_id: number = 0;

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

  created: Date | null = new Date();
  updated: Date | null = new Date();

  _immutables = ["id", "created", "updated"];

  parseObject(object: any): AdminModel {
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
    return instance;
  }
}
