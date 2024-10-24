import AdminRoleTypes from "@src/enums/AdminRoleTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class AdminRoleModel
  extends DBModel<AdminRoleModel>
  implements IParsable<AdminRoleModel>
{
  id: number = 0;
  name: AdminRoleTypes = AdminRoleTypes.ROOT;
  description: string = "";

  parseObject(object: any): AdminRoleModel {
    const instance = new AdminRoleModel();
    instance.id = object.id;
    instance.name = object.name;
    instance.description = object.description;
    return instance;
  }
}
