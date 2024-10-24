import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class AdminSessionModel
  extends DBModel<AdminSessionModel>
  implements IParsable<AdminSessionModel>
{
  id: number = 0;
  admin_id: number = 0;
  created: Date | null = new Date();
  updated: Date | null = new Date();
  expire?: Date;
  token: string = "";

  _immutables = ["id", "created", "updated"];

  parseObject(object: any): AdminSessionModel {
    const instance = new AdminSessionModel();
    instance.id = object.id;
    instance.admin_id = object.admin_id;
    instance.created = object.created ? new Date(object.created) : null;
    instance.updated = object.updated ? new Date(object.updated) : null;
    instance.expire = object.expire ?? new Date(object.expire);
    instance.token = object.token;
    return instance;
  }
}
