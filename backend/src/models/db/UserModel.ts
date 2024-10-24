import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class UserModel
  extends DBModel<UserModel>
  implements IParsable<UserModel>
{
  id: number = 0;
  username: string = "";
  email: string = "";
  firstname: string = "";
  surname: string = "";
  phone: string = "";
  password: string = "";
  login_attempts: number = 0;
  verified: boolean = false;
  created: Date | null = new Date();
  updated: Date | null = new Date();

  _immutables = ["id", "created", "updated"];

  parseObject(object: any): UserModel {
    const instance = new UserModel();
    instance.id = object.id;
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
