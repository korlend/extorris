import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import AdminRoleTypes from "@src/enums/AdminRoleTypes.js";
import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class AdminRoleModel
  extends DBModel<AdminRoleModel>
  implements IParsable<AdminRoleModel>
{
  _tableName: string = "admin_roles";
  _entityType: EntityType = EntityType.ADMIN_ROLE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.STRING_SELECT, {
    stringList: Object.values(AdminRoleTypes),
  })
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
