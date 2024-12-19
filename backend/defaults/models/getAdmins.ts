import PasswordHelper from "@src/core/utils/PasswordHelper.js";
import AdminRoleTypes from "@src/enums/AdminRoleTypes.js";
import { AdminModel, AdminRoleModel } from "@src/models/db/index.js";

const generateDefaults = async (adminRoles: Array<AdminRoleModel>) => {
  const array: Array<AdminModel> = [];
  {
    const admin = new AdminModel();
    const role = adminRoles.find((v) => v.name === AdminRoleTypes.ROOT)
    if (!role) {
      throw new Error(`Cannot create new admin, role "${AdminRoleTypes.ROOT}" doesn't exist in database`)
    }
    admin.username = "root";
    admin.password = await PasswordHelper.encryptPassword("1234");
    array.push(admin);
  }
  return array;
};

export default generateDefaults;
