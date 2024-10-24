import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class AdminModel
  extends DBModel<AdminModel>
  implements IParsable<AdminModel>
{
  id: number = 0;
  role_id: number = 0;
  username: string = "";
  email: string = "";
  firstname: string = "";
  surname: string = "";
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
