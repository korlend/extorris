import AdminRoleTypes from "@src/enums/AdminRoleTypes.js";
import { AdminRoleModel } from "@src/models/db/index.js";

const generateDefaults = () => {
  const array: Array<AdminRoleModel> = [];
  const roles = Object.values(AdminRoleTypes)
  for (let i = 0; i < roles.length; i++) {
    const role = new AdminRoleModel();
    role.name = roles[i];
    array.push(role);
  }
  return array;
}

export default generateDefaults;
