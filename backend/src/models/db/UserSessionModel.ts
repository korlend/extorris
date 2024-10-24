import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class UserSessionModel
  extends DBModel<UserSessionModel>
  implements IParsable<UserSessionModel>
{
  id: number = 0;
  user_id: number = 0;
  created?: Date;
  expire?: Date;
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
